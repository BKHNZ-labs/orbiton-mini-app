import { getSimulateExactInAmountOut } from "@/apis/indexer";
import { ROUTER_ADDRESS } from "@/constants";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { useJettonWallet } from "@/hooks/useJettonWallet";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, beginCell, Dictionary, OpenedContract, toNano } from "@ton/core";
import {
  JettonMinterWrapper,
  JettonWalletWrapper,
  MAX_SQRT_RATIO,
  MIN_SQRT_RATIO,
  PoolWrapper,
} from "orbiton-contracts-sdk";
import { useEffect, useState } from "react";

export const useSwap = () => {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const [simulateParams, setSimulateParams] = useState<{
    tokenIn: string;
    tokenOut: string;
    amountIn: string | undefined;
    // swapper: Address | undefined;
  }>({
    tokenIn: "",
    tokenOut: "",
    amountIn: undefined,
    // swapper: sender.address,
  });
  const [simulateResponse, setSimulateResponse] = useState({
    jettonRouterWallet0: "",
    jettonRouterWallet1: "",
    simulateAmountOut: "0",
    zeroForOne: true,
    tickSpacing: 0,
    fee: 0,
  });

  // useEffect(() => {
  //   if (sender) {
  //     setSimulateParams((prev) => ({
  //       ...prev,
  //       swapper: sender.address,
  //     }));
  //   }
  // }, [sender]);

  useEffect(() => {
    (async () => {
      if (
        !simulateParams.tokenIn ||
        !simulateParams.tokenOut ||
        !simulateParams.amountIn 
      ) {
        return;
      }
      const response = await getSimulateExactInAmountOut(
        simulateParams.tokenIn,
        simulateParams.tokenOut,
        simulateParams.amountIn,
        sender.address?.toString() || ""
      );
      setSimulateResponse(response);
    })();
  }, [simulateParams, sender]);

  // const { jettonMinter: jettonMinter0, jettonWallet: tokenInContract } =
  //   useJettonWallet(simulateParams.tokenIn);
  // const { jettonMinter: jettonMinterOut } = useJettonWallet(
  //   simulateParams.tokenOut
  // );

  const jettonMinter0 = useAsyncInitialize(async () => {
    if (!client || !simulateParams.tokenIn) return null;
    const contract = new JettonMinterWrapper.JettonMinter(
      Address.parse(simulateParams.tokenIn)
    );

    return client.open(
      contract
    ) as OpenedContract<JettonMinterWrapper.JettonMinter>;
  }, [client, simulateParams]);

  const jettonWallet0 = useAsyncInitialize(async () => {
    if (!jettonMinter0) return null;
    return jettonMinter0.getWalletAddress(sender.address!);
  }, [jettonMinter0]);

  const tokenInContract = useAsyncInitialize(async () => {
    if (!client || !jettonWallet0) return;
    const contract = new JettonWalletWrapper.JettonWallet(
      jettonWallet0
    );
    return client.open(contract) as OpenedContract<JettonWalletWrapper.JettonWallet>;
  }, [client, jettonWallet0]);

  const jettonMinter1 = useAsyncInitialize(async () => {
    if (!client || !simulateParams.tokenOut) return null;
    const contract = new JettonMinterWrapper.JettonMinter(
      Address.parse(simulateParams.tokenOut)
    );
    return client.open(
      contract
    ) as OpenedContract<JettonMinterWrapper.JettonMinter>;
  }, [client, simulateParams]);

  const routerWalletOut = useAsyncInitialize(async () => {
    const routerWalletOut = await jettonMinter1?.getWalletAddress(
      Address.parse(ROUTER_ADDRESS)
    );
    return routerWalletOut;
  }, [jettonMinter1]);

  return {
    swap: () => {
      console.log({ simulateResponse, routerWalletOut, sender, simulateParams, jettonMinter0, jettonMinter1 })
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
