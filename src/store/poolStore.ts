import { create } from "zustand";
import tokens from "@/assets/tokens.json";
import { Token } from "@/interfaces";
import { toValue } from "@/utils/helpers";
import { getJettonBalances } from "@/apis/ton-api";
import { getPoolList } from "@/apis/indexer";

const poolStore = (set: any, get: any) => ({
  poolList: [],
  fetchPoolList: async (tokens: Token[]) => {
    await getPoolList();   
  }
});

const usePoolStore = create(poolStore);

export default usePoolStore;
