import { Token } from "@/interfaces";
import BigNumber from "bignumber.js";

export const isNative = (token: Token) => token.type === "native";

export const toValue = (balance: string, decimals: number, price: string) => {
  const value = parseFloat(balance) * parseFloat(price);
  return (value / 10 ** decimals).toFixed(2);
};


// Constants
const Q96 = new BigNumber(2).pow(96);
const Q128 = new BigNumber(2).pow(128);

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

export function getPrice(sqrtPriceX96: bigint, decimal0: number, decimal1: number): { priceToken0InToken1: string, priceToken1InToken0: string } {
  const sqrtPriceBN = new BigNumber(sqrtPriceX96.toString());

  // Calculate the price of Token0 in terms of Token1
  const priceToken0InToken1 = sqrtPriceBN.div(Q96).pow(2).div(new BigNumber(10).pow(decimal1 - decimal0));


  console.log(priceToken0InToken1.toString());

  // Calculate the price of Token1 in terms of Token0 (inverse of the above)
  const priceToken1InToken0 = new BigNumber(1).div(priceToken0InToken1);

  // Format prices for readability
  const priceToken0InToken1Formatted = priceToken0InToken1.toFixed(6);  // You can adjust decimal precision here
  const priceToken1InToken0Formatted = priceToken1InToken0.toFixed(6);  // You can adjust decimal precision here

  console.log(`Price of 1 Token0 in terms of Token1: 1 Token0 = ${priceToken0InToken1Formatted} Token1`);
  console.log(`Price of 1 Token1 in terms of Token0: 1 Token1 = ${priceToken1InToken0Formatted} Token0`);

  return { priceToken0InToken1: priceToken0InToken1Formatted, priceToken1InToken0: priceToken1InToken0Formatted };
}

export function toFraction(decimal: number) {
  const precision = 1e9;
  const numerator = Math.round(decimal * precision);
  const denominator = precision;
  const gcd: (a: number, b: number) => number = (a: number, b: number) =>
    b === 0 ? a : gcd(b, a % b);
  const commonDivisor = gcd(numerator, denominator);

  return {
    numerator: numerator / commonDivisor,
    denominator: denominator / commonDivisor,
  };
};

export function getClosestTick(price: BigNumber, tickSpacing: number): number {
  const MIN_TICK = -887272; // Define the minimum tick value
  const MAX_TICK = 887272;  // Define the maximum tick value
  const SQRT_1_0001 = new BigNumber('1.0001').sqrt(); // √1.0001

  // Ensure the price is valid (price > 0)
  if (price.isLessThanOrEqualTo(0)) {
    throw new Error('Price must be greater than 0');
  }

  let tick = 0;
  let currentPrice = new BigNumber(1); // Starting at price corresponding to tick = 0

  if (price.isGreaterThan(1)) {
    // Moving up the ticks
    while (currentPrice.isLessThan(price) && tick < MAX_TICK) {
      currentPrice = currentPrice.multipliedBy(SQRT_1_0001);
      tick++;
    }
  } else {
    // Moving down the ticks
    while (currentPrice.isGreaterThan(price) && tick > MIN_TICK) {
      currentPrice = currentPrice.dividedBy(SQRT_1_0001);
      tick--;
    }
  }

  // Adjust tick for tickSpacing
  const tickRemainder = tick % tickSpacing;
  if (tickRemainder !== 0) {
    tick -= tickRemainder; // Move down to the nearest valid tick
  }

  // Return the tick closer to the given price
  const nextPrice = tick > 0
    ? currentPrice.multipliedBy(SQRT_1_0001)
    : currentPrice.dividedBy(SQRT_1_0001);

  if (price.minus(currentPrice).abs().isLessThan(price.minus(nextPrice).abs())) {
    return tick;
  } else {
    return tick + (tick > 0 ? tickSpacing : -tickSpacing);
  }
}
