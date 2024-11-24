import { getSimulateExactInAmountOut } from "@/apis/indexer";
import { ROUTER_ADDRESS } from "@/constants";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useJettonWallet } from "@/hooks/useJettonWallet";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, beginCell, Dictionary, toNano } from "@ton/core";
import {
  JettonWalletWrapper,
  MAX_SQRT_RATIO,
  MIN_SQRT_RATIO,
  PoolWrapper,
} from "orbiton-contracts-sdk";
import { useEffect, useState } from "react";

export const useSwap = () => {
  const { sender } = useTonConnect();
  const client = useTonClient();

  const [simulateParams, setSimulateParams] = useState<{
    tokenIn: string;
    tokenOut: string;
    amountIn: string | undefined;
    swapper: Address | undefined;
  }>({
    tokenIn: "",
    tokenOut: "",
    amountIn: undefined,
    swapper: sender.address,
  });
  const [simulateResponse, setSimulateResponse] = useState({
    jettonRouterWallet0: "",
    jettonRouterWallet1: "",
    simulateAmountOut: "0",
    zeroForOne: true,
    tickSpacing: 0,
    fee: 0,
  });

  useEffect(() => {
    (async () => {
      if (!simulateParams.swapper) {
        setSimulateParams({ ...simulateParams, swapper: sender.address });
      }
      if (
        !simulateParams.tokenIn ||
        !simulateParams.tokenOut ||
        !simulateParams.swapper ||
        !simulateParams.amountIn
      ) {
        return;
      }
      const response = await getSimulateExactInAmountOut(
        simulateParams.tokenIn,
        simulateParams.tokenOut,
        simulateParams.amountIn,
        simulateParams.swapper.toString()
      );
      setSimulateResponse(response);
    })();
  }, [simulateParams, sender]);

  const { jettonMinter: jettonMinter0, jettonWallet: tokenInContract } =
    useJettonWallet(simulateParams.tokenIn);

  const routerWalletOut = useAsyncInitialize(async () => {
    const routerWalletOut = await jettonMinter0?.getWalletAddress(
      Address.parse(ROUTER_ADDRESS)
    );
    return routerWalletOut;
  }, [jettonMinter0]);

  return {
    swap: () => {
      if (!routerWalletOut || !sender?.address || !simulateParams.amountIn) {
        throw new Error("Router wallet out is not initialized");
      }
      if (!simulateResponse.fee) {
        throw new Error("Simulate response is not initialized");
      }
      return tokenInContract?.sendTransferSwap(
        sender,
        {
          kind: "OpJettonTransferSwap",
          query_id: 0,
          jetton_amount: BigInt(simulateParams.amountIn),
          to_address: Address.parse(ROUTER_ADDRESS),
          response_address: sender.address,
          custom_payload: beginCell().storeDict(Dictionary.empty()).endCell(),
          forward_ton_amount: toNano(0.09),
          either_payload: true,
          swap: {
            kind: "SwapParams",
            forward_opcode: PoolWrapper.Opcodes.Swap,
            fee: simulateResponse.fee,
            jetton1_wallet: routerWalletOut,
            sqrt_price_limit: simulateResponse.zeroForOne
              ? MIN_SQRT_RATIO
              : MAX_SQRT_RATIO,
            tick_spacing: simulateResponse.tickSpacing,
            zero_for_one: simulateResponse.zeroForOne ? -1 : 0,
          },
        },
        {
          value: toNano("0.13"),
        }
      );
    },
    simulateParams,
    simulateResponse,
    setSimulateParams,
  };
};
