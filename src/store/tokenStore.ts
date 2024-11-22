import { create } from "zustand";
import tokens from "@/assets/tokens.json";
import { Token } from "@/interfaces";
import { toValue } from "@/utils/helpers";
import { getJettonBalances } from "@/apis/ton-api";

const tokenStore = (set: any, get: any) => ({
  tokenList: (tokens as Token[]).length > 0 ? tokens : [],
  setBalance: (id: number, balance: string) => {
    set((state: any) => {
      const tokenList = state.tokenList.map((token: Token) => {
        if (token.id === id) {
          return {
            ...token,
            balance,
            value: toValue(balance, token.decimals, token.price),
          };
        }
        return token;
      });
      return { tokenList };
    });
  },
  // get all balance from all tokens in the list in one api call
  fetchBalance: async (address: string) => {
    // FIXME: use ton api when in mainnet, the testnet is too slow
    // get tokenList from store
    const tokenList = get().tokenList as Token[];
    // fetch balance from api
    const tokens = await getJettonBalances(address, tokenList);
    // setBalance(tokenId, balance)
    for (const tokenId in tokens) {
      set((state: any) => {
        const tokenList = state.tokenList.map((token: Token) => {
          if (token.address === tokenId) {
            return {
              ...token,
              balance: tokens[tokenId],
              value: toValue(
                tokens[tokenId].toString(),
                token.decimals,
                token.price
              ),
            };
          }
          return token;
        });
        return { tokenList };
      });
    }
  },
});

const useTokenStore = create(tokenStore);

export default useTokenStore;
