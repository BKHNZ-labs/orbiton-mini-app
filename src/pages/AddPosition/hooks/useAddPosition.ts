import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useEffect, useMemo, useState } from "react";
import {
  encodePriceSqrt,
  JettonMinterWrapper,
  RouterWrapper,
} from "orbiton-contracts";
import { Address, OpenedContract, toNano } from "@ton/core";
import { FEE_MAP, ROUTER_ADDRESS } from "@/constants";
import { Token } from "@/interfaces";
import { Pool } from "@/interfaces/pool";
import useTokenStore from "@/store/tokenStore";
import { FeeAmount } from "@/interfaces/fee";

export const useAddPosition = (isCreatedPool: boolean, poolInfo?: Pool) => {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const tokens = useTokenStore((state) => state.tokenList) as Token[];

  const [fee, setFee] = useState(
    isCreatedPool ? FeeAmount.MEDIUM : (poolInfo as Pool).friendlyFee
  );

  const friendlyFee = FEE_MAP.find((f) => f.value === fee)?.friendlyValue;

  const [token0, setToken0] = useState(
    isCreatedPool ? tokens[0] : (poolInfo as Pool).token0
  );
  const [token1, setToken1] = useState(
    isCreatedPool ? tokens[1] : (poolInfo as Pool).token1
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

  const { reserve0, reserve1 } = useMemo(() => {
    if (isCreatedPool) {
      const initPrice = Number(createPoolParams.initPrice);
      const toFraction = (decimal: number) => {
        const precision = 1e9;
        const numerator = Math.round(decimal * precision);
        const denominator = precision;
        const gcd: (a: number, b: number) => number = (a: number, b: number) =>
          b === 0 ? a : gcd(b, a % b);
        const commonDivisor = gcd(numerator, denominator);

        return {
          numerator: numerator / commonDivisor,
          denominator: denominator / commonDivisor,
        };
      };

      const { numerator, denominator } = toFraction(initPrice);
      console.log({ numerator, denominator });
      return {
        reserve0: denominator,
        reserve1: numerator,
      };
    }

    return { reserve0: 0, reserve1: 0 }; // Default when the pool is created
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
      console.log("createPoolParams", {
        kind: "OpCreatePool",
        query_id: 0,
        jetton0_wallet: routerJettonWallet0 as any,
        jetton1_wallet: routerJettonWallet1 as any,
        fee: Number(fee),
        sqrt_price_x96: encodePriceSqrt(BigInt(reserve0), BigInt(reserve1)),
        tick_spacing: Number(tickSpacing),
      });
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
