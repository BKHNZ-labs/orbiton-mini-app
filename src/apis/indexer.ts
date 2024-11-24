import { indexerInstance as axios } from "./index";

export const getPoolList = async () => {
  const response = await axios.get("pool");

  console.log(response.data.data);
};

export const getSimulateExactInAmountOut = async (
  jettonRouterIn: string,
  jettonRouterOut: string,
  amountIn: string
) => {
  const response = await axios.get("");
  return {
    jettonRouterWallet0: "jettonRouterWallet0",
    jettonRouterWallet1: "jettonRouterWallet1",
    simulateAmountOut: "0",
    tickSpacing: 0,
    fee: 0,
  };
};
