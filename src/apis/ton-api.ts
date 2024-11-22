import axios from "@/apis";
import { Token } from "@/interfaces";
import { Address } from "@ton/core";

// max 1000 jetton wallets
export const getJettonBalances = async (
  address: string,
  tokenList: Token[]
): Promise<Record<string, bigint>> => {
  const response = await axios.get(
    `jetton/wallets?owner_address=${address}&limit=1000&offset=0`
  );

  const jettonMasters = tokenList
    .filter((token) => token.type === "jetton")
    .map((token) => {
      return {
        hash: Address.parseFriendly(
          token.address as string
        ).address.hash.toString(),
        friendlyAddress: token.address!,
      };
    });

  const tokens: Record<string, bigint> = {};

  const jettonMasterResponse = response.data.jetton_wallets.map(
    (wallet: any) => {
      return {
        hash: Address.parseRaw(wallet.jetton).hash.toString(),
        balance: BigInt(wallet.balance),
      };
    }
  );

  // set balance
  jettonMasterResponse.forEach((walletHash: any) => {
    const jettonFound = jettonMasters.find(
      (master) => master.hash === walletHash.hash
    );
    if (jettonFound) {
      tokens[jettonFound.friendlyAddress] = walletHash.balance;
    }
  });

  return tokens;
};
