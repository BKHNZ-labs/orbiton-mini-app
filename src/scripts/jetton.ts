import { Address, TonClient } from "@ton/ton";
import { JettonMinterWrapper } from "orbiton-contracts";

export const getJettonBalance = async (
  client: TonClient,
  user: Address,
  jettonMaster: Address
) => {
    const jettonMinter = client.open(
      JettonMinterWrapper.JettonMinter.createFromAddress(jettonMaster)
    );
    const jettonWallet = await jettonMinter.getWalletAddress(user);
    const balance = await client.getBalance(jettonWallet);
    console.log(balance.toString());
    return balance;
};
