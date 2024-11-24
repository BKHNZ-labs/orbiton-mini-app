import { useJettonWallet } from "@/hooks/useJettonWallet";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { JettonWalletWrapper } from "orbiton-contracts-sdk";

export const useSwap = (
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  swapper: string
) => {
  const { sender } = useTonConnect();
  const client = useTonClient();
  const { jettonMinter: jettonMinter0, jettonWallet: jettonWallet0 } =
    useJettonWallet(tokenIn);

  const tokenInContract = client?.open(
    JettonWalletWrapper.JettonWallet.createFromAddress(jettonWallet0!)
  );
};
