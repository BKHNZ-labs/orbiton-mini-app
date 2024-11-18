import { create } from "zustand";
import tokens from "@/assets/tokens.json";
import { Token } from "@/interfaces";
import { toValue } from "@/utils/helpers";

const tokenStore = (set: any, _get: any) => ({
  tokenList: tokens as Token[],
  setBalance: (id: number, balance: string) => {
    set((state: any) => {
      const tokenList = state.tokenList.map((token: Token) => {
        if (token.id === id) {
          return { ...token, balance, value: toValue(balance, token.decimals, token.price) };
        }
        return token;
      });
      return { tokenList };
    });
  },
});

const useTokenStore = create(tokenStore);

export default useTokenStore;