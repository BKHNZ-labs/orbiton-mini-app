import { indexerInstance as axios } from "./index";

export type PoolResponse = {
    _id: string;
    poolAddress: string;
    jetton0WalletAddress: string;
    jetton1WalletAddress: string;
    fee: number;
    tickSpacing: number;
    liquidity: string;
    totalVolume: string;
    totalFee: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    jetton0MasterAddress: string;
    jetton1MasterAddress: string;
} 

export const getPoolList = async () => {
  const response = await axios.get("pool");

    const poolList: PoolResponse[] = response.data.data;
    return poolList;
}

export type SimulateResponse = {
  receivedAmount: string;
  executeGasConsumed: string;
  zeroForOne: number;
  pool: {
    poolAddress: string;
    jetton0WalletAddress: string;
    jetton1WalletAddress: string;
    jetton0MasterAddress: string;
    jetton1MasterAddress: string;
    fee: number;
    tickSpacing: number;
  };
};

export const getSimulateExactInAmountOut = async (
  jettonInAddress: string,
  jettonOutAddress: string,
  jettonInAmount: string,
  senderAddress: string
) => {
  const searchParams = new URLSearchParams();
  searchParams.append("jettonInAddress", jettonInAddress);
  searchParams.append("jettonOutAddress", jettonOutAddress);
  searchParams.append("jettonInAmount", jettonInAmount);
  searchParams.append("senderAddress", senderAddress);

  const response = await axios.get(
    `pool/simulate_swap?${searchParams.toString()}`
  );
  const data = response.data.data as SimulateResponse;
  return {
    zeroForOne: data.zeroForOne == -1,
    jettonRouterWallet0: data.pool.jetton0WalletAddress,
    jettonRouterWallet1: data.pool.jetton1WalletAddress,
    simulateAmountOut: data.receivedAmount,
    tickSpacing: data.pool.tickSpacing,
    fee: data.pool.fee,
  };
};
