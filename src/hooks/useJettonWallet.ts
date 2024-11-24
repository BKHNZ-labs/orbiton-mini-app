import {
  JettonMinterWrapper,
  JettonWalletWrapper,
} from "orbiton-contracts-sdk";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "@ton/core";
import { JettonWallet } from "@ton/ton";

export const useJettonWallet = (address: string) => {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const jettonMinter = useAsyncInitialize(async () => {
    if (!client || !address) return null;
    const contract = new JettonMinterWrapper.JettonMinter(
      Address.parse(address)
    );

    return client.open(contract);
  }, [client, address]);

  const jettonWallet = useAsyncInitialize(async () => {
    if (!client || !jettonMinter || !sender?.address) return null;
    const address = await jettonMinter.getWalletAddress(sender.address);
    const contract =
      JettonWalletWrapper.JettonWallet.createFromAddress(address);
    return client.open(contract);
  }, [client, jettonMinter]);

  return {
    jettonWallet,
    jettonMinter,
  };
};
