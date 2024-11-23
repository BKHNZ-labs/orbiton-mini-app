import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useEffect, useMemo, useState } from "react";
import {
  encodePriceSqrt,
  JettonMinterWrapper,
  JettonWalletWrapper,
  PoolWrapper,
  RouterWrapper,
} from "orbiton-contracts-sdk";
import { Address, beginCell, Dictionary, OpenedContract, toNano } from "@ton/core";
import { FEE_MAP, ROUTER_ADDRESS } from "@/constants";
import { Token } from "@/interfaces";
import { Pool } from "@/interfaces/pool";
import useTokenStore from "@/store/tokenStore";
import { FeeAmount } from "@/interfaces/fee";
import { getClosestTick, getPrice, toFraction } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { OpJettonTransferMint, storeOpJettonTransferMint } from "orbiton-contracts-sdk/build/tlb/jetton/transfer";

export const useAddPosition = (isCreatePool: boolean, poolInfo?: Pool) => {
  console.log({ isCreatePool, poolInfo });
  const client = useTonClient();
  const { sender } = useTonConnect();
  const tokens = useTokenStore((state) => state.tokenList) as Token[];
  const [tonConnectUI] = useTonConnectUI();

  const [fee, setFee] = useState(
    isCreatePool ? FeeAmount.MEDIUM : (poolInfo as Pool).fee
  );

  const friendlyFee = FEE_MAP.find((f) => f.value === fee)?.friendlyValue;

  const [token0, setToken0] = useState(
    isCreatePool ? tokens[0] : (poolInfo as Pool).token0
  );
  const [token1, setToken1] = useState(
    isCreatePool ? tokens[1] : (poolInfo as Pool).token1
  );

  const [routerJettonWallet0, setRouterJettonWallet0] = useState<Address>();
  const [routerJettonWallet1, setRouterJettonWallet1] = useState<Address>();

  // change when fee changes
  const tickSpacing = useMemo(() => {
    const feeObj = FEE_MAP.find((f) => f.value === fee);
    return feeObj?.tickSpacing;
  }, [fee]);

  const [createPoolParams, setCreatePoolParams] = useState<{
    initPrice: string;
  }>({
    initPrice: "1.0",
  });

  const [createPositionParams, setCreatePositionParams] = useState<{
    tokenAmount0: string | null;
    tokenAmount1: string | null;
    priceMin: string | null;
    priceMax: string | null;
    currentPrice: string | null;
    liquidity: string | null;
  }>({
    tokenAmount0: null,
    tokenAmount1: null,
    priceMin: null,
    priceMax: null,
    currentPrice: null,
    liquidity: null,
  });

  const { reserve0, reserve1 } = useMemo(() => {
    if (isCreatePool) {
      const initPrice = Number(createPoolParams.initPrice);
      const { numerator, denominator } = toFraction(initPrice);
      console.log({ numerator, denominator });
      return {
        reserve0: denominator,
        reserve1: numerator,
      };
    }

    return { reserve0: 1, reserve1: 1 }; // Default when the pool is created
  }, [createPoolParams]);

  const routerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new RouterWrapper.RouterTest(
      Address.parse(ROUTER_ADDRESS)
    );
    return client.open(contract) as OpenedContract<RouterWrapper.RouterTest>;
  }, [client]);

  const jettonMinter0 = useAsyncInitialize(async () => {
    if (!client || !token0) return null;
    const contract = new JettonMinterWrapper.JettonMinter(
      Address.parse(token0.address!)
    );

    return client.open(
      contract
    ) as OpenedContract<JettonMinterWrapper.JettonMinter>;
  }, [client, token0]);

  const jettonMinter1 = useAsyncInitialize(async () => {
    if (!client || !token1) return null;
    const contract = new JettonMinterWrapper.JettonMinter(
      Address.parse(token1.address!)
    );
    return client.open(
      contract
    ) as OpenedContract<JettonMinterWrapper.JettonMinter>;
  }, [client, token1]);

  const poolContract = useAsyncInitialize(async () => {
    if (!client || !poolInfo) return null;
    const contract = new PoolWrapper.PoolTest(Address.parse(poolInfo.address));
    return client.open(contract) as OpenedContract<PoolWrapper.PoolTest>;
  }, [client, poolInfo]);

  const jettonWallet0 = useAsyncInitialize(async () => {
    if (!jettonMinter0) return null;
    return jettonMinter0.getWalletAddress(sender.address!);
  }, [jettonMinter0]);

  const jettonWallet1 = useAsyncInitialize(async () => {
    if (!jettonMinter1) return null;
    return jettonMinter1.getWalletAddress(sender.address!);
  }, [jettonMinter1]);

  useEffect(() => {
    async function initPosition() {
      if (!poolContract) return;
      const { fee, liquidity, sqrtPriceX96, tick, tickSpacing } = await poolContract.getPoolInfo();

      setFee(Number(fee));
      console.log(sqrtPriceX96)
      let res = getPrice(sqrtPriceX96, token0.decimals, token1.decimals);
      const currPrice = res.priceToken0InToken1;

      // currentPrice -> set the lower price and upper price spread to 10%
      const priceSpread = 0.1;
      const priceMin = Number(currPrice) * (1 - priceSpread);
      const priceMax = Number(currPrice) * (1 + priceSpread);

      setCreatePositionParams({
        priceMax: priceMax.toString(),
        priceMin: priceMin.toString(),
        tokenAmount0: "0",
        tokenAmount1: "0",
        currentPrice: currPrice,
        liquidity: liquidity.toString(),
      })
    }

    initPosition();
  }, [client, poolContract]);

  const ticks = useAsyncInitialize(async (): Promise<[number, number]> => {
    if (createPositionParams.currentPrice && createPositionParams.priceMin && createPositionParams.priceMax && tickSpacing) {
      const tickLower = getClosestTick(BigNumber(createPositionParams.priceMin), tickSpacing)
      const tickUpper = getClosestTick(BigNumber(createPositionParams.priceMax), tickSpacing);

      return [tickLower, tickUpper];
    } else {
      return [0, 0];
    }
  }, [createPositionParams]);

  const tickLower = ticks ? ticks[0] : 0;
  const tickUpper = ticks ? ticks[1] : 0;

  useEffect(() => {
    async function getRouterJettonWallets() {
      if (!jettonMinter0 || !jettonMinter1) return;
      const jettonWallet0 = await jettonMinter0.getWalletAddress(
        Address.parse(ROUTER_ADDRESS)
      );
      const jettonWallet1 = await jettonMinter1.getWalletAddress(
        Address.parse(ROUTER_ADDRESS)
      );
      setRouterJettonWallet0(jettonWallet0);
      setRouterJettonWallet1(jettonWallet1);
    }

    getRouterJettonWallets();
  }, [jettonMinter0, jettonMinter1]);

  return {
    createPool: () => {
      return routerContract?.sendCreatePool(
        sender,
        {
          kind: "OpCreatePool",
          query_id: 0,
          jetton0_wallet: routerJettonWallet0 as any,
          jetton1_wallet: routerJettonWallet1 as any,
          fee: Number(fee),
          sqrt_price_x96: encodePriceSqrt(BigInt(reserve0), BigInt(reserve1)),
          tick_spacing: Number(tickSpacing),
        },
        {
          value: toNano("0.1"),
        }
      );
    },
    createPosition: () => {
      const data0: OpJettonTransferMint = {
        kind: 'OpJettonTransferMint',
        query_id: 0,
        jetton_amount: BigInt(createPositionParams.tokenAmount0!),
        to_address: Address.parse(ROUTER_ADDRESS),
        response_address: sender.address!,
        custom_payload: beginCell().storeDict(Dictionary.empty()).endCell(),
        forward_ton_amount: toNano(0.8),
        either_payload: true,
        mint: {
          kind: 'MintParams',
          forward_opcode: PoolWrapper.Opcodes.Mint,
          jetton1_wallet: routerJettonWallet1!,
          tick_lower: tickLower,
          tick_upper: tickUpper,
          tick_spacing: tickSpacing!,
          fee: fee,
          liquidity_delta: BigInt(createPositionParams.liquidity!),
        }
      }
      const body0 = beginCell();
      storeOpJettonTransferMint(data0)(body0);
      tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: body0.toBoc().toString("base64"),
          }
        ],
        validUntil: Date.now() + 5 * 60 * 1000,
      })
    },
    setFee: (fee: FeeAmount) => setFee(fee),
    setToken0: (token: Token) => setToken0(token),
    setToken1: (token: Token) => setToken1(token),
    setCreatePoolParams: (params: { initPrice: string }) =>
      setCreatePoolParams(params),
    fee,
    friendlyFee,
    token0,
    token1,
    createPoolParams,
  };
};
