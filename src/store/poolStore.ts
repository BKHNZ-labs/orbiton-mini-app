import { create } from "zustand";
import { Token } from "@/interfaces";
import { getPoolList } from "@/apis/indexer";
import { Pool } from "@/interfaces/pool";

const poolStore = (set: any, get: any) => ({
  poolList: [],
  fetchPoolList: async (tokens: Token[]) => {
    const poolRes = await getPoolList();
    console.log(poolRes);
    const pools = poolRes.map((pool) => {
      const poolConverted: Pool = {
        id: pool._id,
        address: pool.poolAddress,
        token0: tokens.find((token) => token.address === pool.jetton0MasterAddress)!,
        token1: tokens.find((token) => token.address === pool.jetton1MasterAddress)!,
        token0Amount: "3.93",
        token1Amount: "21.3",
        apr: "24.96",
        tvl: "42.66",
        volume: "8.97",
        fee: Number(pool.fee),
        fees: pool.totalFee,
        tickSpacing: pool.tickSpacing,
        friendlyFee: `${pool.fee / 10 ** 4}%`,
      }
      return poolConverted;
    });
    set({ poolList: pools });
  }
});

const usePoolStore = create(poolStore);

export default usePoolStore;
