import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useEffect, useMemo, useState } from "react";
import {
  encodePriceSqrt,
  JettonMinterWrapper,
  PoolWrapper,
  RouterWrapper,
} from "orbiton-contracts-sdk";
import { Address, beginCell, Dictionary, OpenedContract, toNano } from "@ton/core";
import { FEE_MAP, ROUTER_ADDRESS } from "@/constants";
import { Token } from "@/interfaces";
import { Pool } from "@/interfaces/pool";
import useTokenStore from "@/store/tokenStore";
import { FeeAmount } from "@/interfaces/fee";
import { calculateOtherAmount0, calculateOtherAmount1, getPrice, priceToClosestTick, toFraction } from "@/utils/helpers";
import BigNumber from "bignumber.js";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { OpJettonTransferMint, storeOpJettonTransferMint } from "orbiton-contracts-sdk/build/tlb/jetton/transfer";
import { TickMath } from "@pancakeswap/v3-sdk";

export const useAddPosition = (isCreatePool: boolean, poolInfo?: Pool) => {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const tokens = useTokenStore((state) => state.tokenList) as Token[];
  const [tonConnectUI] = useTonConnectUI();

  const [fee, setFee] = useState(
    isCreatePool ? FeeAmount.MEDIUM : (poolInfo as Pool).fee
  );

  const friendlyFee = FEE_MAP.find((f) => f.value === fee)?.friendlyValue ? FEE_MAP.find((f) => f.value === fee)?.friendlyValue : poolInfo?.friendlyFee;

  const [token0, setToken0] = useState(
    isCreatePool ? tokens[0] : (poolInfo as Pool).token0
  );

  const [focusID, setFocusID] = useState(0);

  const [token1, setToken1] = useState(
    isCreatePool ? tokens[1] : (poolInfo as Pool).token1
  );

  const [amount0, setAmount0] = useState<string>("0");
  const [amount1, setAmount1] = useState<string>("0");
  const [posLiquidity, setPosLiquidity] = useState<string>("0");

  const tokenAmount0 = useMemo(() => {
    return new BigNumber(amount0).times(new BigNumber(10).pow(token0.decimals)).toString();
  }, [amount0, token0]);

  const tokenAmount1 = useMemo(() => {
    return new BigNumber(amount1).times(new BigNumber(10).pow(token1.decimals)).toString();
  }, [amount1, token1]);

  useEffect(() => {
    if (token0 && token1 && createPositionParams.sqrtPriceX96) {
      // input amount 0
      if (focusID === 0) {
        if (!amount0) return;
        const { amount, liquidity } = calculateOtherAmount0(TickMath.getSqrtRatioAtTick(tickLower), TickMath.getSqrtRatioAtTick(tickUpper), tokenAmount0);
        const amountInFixed = new BigNumber(amount.toString()).div(new BigNumber(10).pow(token1.decimals)).toFixed(2);
        setAmount1(amountInFixed);
        setPosLiquidity(liquidity.toString());
      }

      // input amount 1
      if (focusID === 1) {
        if (!amount1) return;
        const { amount, liquidity } = calculateOtherAmount1(TickMath.getSqrtRatioAtTick(tickLower), TickMath.getSqrtRatioAtTick(tickUpper), tokenAmount1);
        const amountInFixed = new BigNumber(amount.toString()).div(new BigNumber(10).pow(token0.decimals)).toFixed(2);
        setAmount0(amountInFixed);
        setPosLiquidity(liquidity.toString());
      }
    }
  }, [amount0, amount1]);

  const [routerJettonWallet0, setRouterJettonWallet0] = useState<Address>();
  const [routerJettonWallet1, setRouterJettonWallet1] = useState<Address>();

  // change when fee changes
  const tickSpacing = useMemo(() => {
    if (poolInfo?.tickSpacing) return poolInfo.tickSpacing;
    const feeObj = FEE_MAP.find((f) => f.value === fee);
    return feeObj?.tickSpacing;
  }, [fee]);

  const [createPoolParams, setCreatePoolParams] = useState<{
    initPrice: string;
  }>({
    initPrice: "1.0",
  });

  const [createPositionParams, setCreatePositionParams] = useState<{
    priceMin: string | null;
    priceMax: string | null;
    currentPrice: string | null;
    liquidity: string | null;
    sqrtPriceX96: string | null;
  }>({
    priceMin: null,
    priceMax: null,
    currentPrice: null,
    liquidity: null,
    sqrtPriceX96: null,
  });

  const { reserve0, reserve1 } = useMemo(() => {
    if (isCreatePool) {
      const initPrice = Number(createPoolParams.initPrice);
      const { numerator, denominator } = toFraction(initPrice);
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
      const { fee, liquidity, sqrtPriceX96, tick } = await poolContract.getPoolInfo();
      console.log('tick', tick);
      setFee(Number(fee));
      let res = getPrice(sqrtPriceX96, token0.decimals, token1.decimals);
      const currPrice = res.priceToken0InToken1;

      // currentPrice -> set the lower price and upper price spread to 10%
      const priceSpread = 0.1;
      const priceMin = Number(currPrice) * (1 - priceSpread);
      const priceMax = Number(currPrice) * (1 + priceSpread);

      setCreatePositionParams({
        priceMax: priceMax.toFixed(9),
        priceMin: priceMin.toFixed(9),
        currentPrice: currPrice,
        liquidity: liquidity.toString(),
        sqrtPriceX96: sqrtPriceX96.toString(),
      })
    }
    initPosition();
  }, [client, poolContract]);

  // ticks transform
  const ticks = useAsyncInitialize(async (): Promise<[number, number]> => {
    if (createPositionParams.currentPrice && createPositionParams.priceMin && createPositionParams.priceMax && tickSpacing) {
      const tickLower = priceToClosestTick(Number(createPositionParams.priceMin), tickSpacing)
      const tickUpper = priceToClosestTick(Number(createPositionParams.priceMax), tickSpacing);
      console.log('tickLower', tickLower, 'tickUpper', tickUpper);
      return [tickLower, tickUpper];
    } else {
      return [0, 0];
    }
  }, [createPositionParams]);
  const tickLower = ticks ? ticks[0] : 0;
  const tickUpper = ticks ? ticks[1] : 0;

  useEffect(() => {
    async function getRouterJettonWallets() {
      if (!jettonMinter0) return;
      const jettonWallet0 = await jettonMinter0.getWalletAddress(
        Address.parse(ROUTER_ADDRESS)
      );
      console.log('jettonWallet0', jettonWallet0);
      setRouterJettonWallet0(jettonWallet0);
      if (!jettonMinter1) return;
      const jettonWallet1 = await jettonMinter1.getWalletAddress(
        Address.parse(ROUTER_ADDRESS)
      );
      console.log('jettonWallet1', jettonWallet1);
      setRouterJettonWallet1(jettonWallet1);
    }

    getRouterJettonWallets();
  }, [jettonMinter0, jettonMinter1, poolContract]);

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
        jetton_amount: BigInt(tokenAmount0),
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
          liquidity_delta: BigInt(posLiquidity),
        }
      }
      console.log('data0', data0);
      const body0 = beginCell();
      storeOpJettonTransferMint(data0)(body0);

      // swap -> to the right
      // button -> sticky to bottom

      const data1: OpJettonTransferMint = {
        kind: 'OpJettonTransferMint',
        query_id: 0,
        jetton_amount: BigInt(tokenAmount1),
        to_address: Address.parse(ROUTER_ADDRESS),
        response_address: sender.address!,
        custom_payload: beginCell().storeDict(Dictionary.empty()).endCell(),
        forward_ton_amount: toNano(0.8),
        either_payload: true,
        mint: {
          kind: 'MintParams',
          forward_opcode: PoolWrapper.Opcodes.Mint,
          jetton1_wallet: routerJettonWallet0!,
          tick_lower: tickLower,
          tick_upper: tickUpper,
          tick_spacing: tickSpacing!,
          fee: fee,
          liquidity_delta: BigInt(posLiquidity),
        },
      }
      const body1 = beginCell();
      storeOpJettonTransferMint(data1)(body1);
      console.log('data1', data1);

      tonConnectUI.sendTransaction({
        messages: [
          {
            address: jettonWallet0!.toString(),
            amount: toNano(1).toString(),
            payload: body0.endCell().toBoc().toString("base64"),
          },
          {
            address: jettonWallet1!.toString(),
            amount: toNano(1).toString(),
            payload: body1.endCell().toBoc().toString("base64"),
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
    setCreatePositionParams: (params: {
      priceMin: string | null;
      priceMax: string | null;
      currentPrice: string | null;
      liquidity: string | null;
      sqrtPriceX96: string | null;
    }) =>
      setCreatePositionParams(params),
    setAmount0: (amount: string) => {
      setFocusID(0);
      setAmount0(amount);
    },
    setAmount1: (amount: string) => {
      setFocusID(1);
      setAmount1(amount);
    },
    setFocusID,
    setPriceMin(price: string) {
      setCreatePositionParams({
        ...createPositionParams,
        priceMin: price,
      });
    },
    setPriceMax(price: string) {
      setCreatePositionParams({
        ...createPositionParams,
        priceMax: price,
      });
    },
    currentPrice: createPositionParams.currentPrice,
    priceMin: createPositionParams.priceMin,
    priceMax: createPositionParams.priceMax,
    amount0,
    amount1,
    fee,
    friendlyFee,
    token0,
    token1,
    createPoolParams,
  };
};
