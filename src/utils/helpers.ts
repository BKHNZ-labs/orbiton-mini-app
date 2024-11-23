import { Token } from "@/interfaces";
import BigNumber from "bignumber.js";

export const isNative = (token: Token) => token.type === "native";

export const toValue = (balance: string, decimals: number, price: string) => {
  const value = parseFloat(balance) * parseFloat(price);
  return (value / 10 ** decimals).toFixed(2);
};


// Constants
const Q96 = new BigNumber(2).pow(96);

// Compute the amount of liquidity for a given amount of token0
export function getLiquidityForAmount0(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  const intermediate = sqrtRatioAX96.multipliedBy(sqrtRatioBX96).div(Q96);
  return amount0
    .multipliedBy(intermediate)
    .div(sqrtRatioBX96.minus(sqrtRatioAX96));
}

// Compute the amount of liquidity for a given amount of token1
export function getLiquidityForAmount1(
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount1: BigNumber
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  return amount1
    .multipliedBy(Q96)
    .div(sqrtRatioBX96.minus(sqrtRatioAX96));
}

// Compute the maximum liquidity for given amounts of token0 and token1
export function getLiquidityForAmounts(
  sqrtRatioX96: BigNumber,
  sqrtRatioAX96: BigNumber,
  sqrtRatioBX96: BigNumber,
  amount0: BigNumber,
  amount1: BigNumber
): BigNumber {
  if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
    [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
  }

  if (sqrtRatioX96.lte(sqrtRatioAX96)) {
    return getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
  } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
    const liquidity0 = getLiquidityForAmount0(
      sqrtRatioX96,
      sqrtRatioBX96,
      amount0
    );
    const liquidity1 = getLiquidityForAmount1(
      sqrtRatioAX96,
      sqrtRatioX96,
      amount1
    );
    return BigNumber.min(liquidity0, liquidity1);
  } else {
    return getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
  }
}
