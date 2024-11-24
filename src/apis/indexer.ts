import { indexerInstance as axios } from "./index";

export const getPoolList = async () => {
  const response = await axios.get("pool");

  console.log(response.data.data);
};

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
