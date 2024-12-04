import { Token } from "@/interfaces";
import BigNumber from "bignumber.js";
// import JSBI from 'jsbi';
// import { TickMath } from '@uniswap/v3-sdk'
// import { encodePriceSqrt } from "orbiton-contracts-sdk";
import { encodeSqrtRatioX96, SqrtPriceMath, TickMath } from "@pancakeswap/v3-sdk";
import { getMaxTick, getMinTick } from "orbiton-contracts-sdk";
import { BigintIsh, ZERO } from "@pancakeswap/swap-sdk-core";
// import { BigintIsh } from "@uniswap/sdk-core";

export const isNative = (token: Token) => token.type === "native";

export const toValue = (balance: string, decimals: number, price: string) => {
  const value = parseFloat(balance) * parseFloat(price);
  return (value / 10 ** decimals).toFixed(2);
};


// Constants
const Q96 = new BigNumber(2).pow(96);
const Q128 = new BigNumber(2).pow(128);
const Q192 = new BigNumber(2).pow(192);

// Compute the amount of liquidity for a given amount of token0
// export function getLiquidityForAmount0(
//   sqrtRatioAX96: BigNumber,
//   sqrtRatioBX96: BigNumber,
//   amount0: BigNumber
// ): BigNumber {
//   if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
//     [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
//   }

//   const intermediate = sqrtRatioAX96.multipliedBy(sqrtRatioBX96).div(Q96);
//   return amount0
//     .multipliedBy(intermediate)
//     .div(sqrtRatioBX96.minus(sqrtRatioAX96));
// }

// // Compute the amount of liquidity for a given amount of token1
// export function getLiquidityForAmount1(
//   sqrtRatioAX96: BigNumber,
//   sqrtRatioBX96: BigNumber,
//   amount1: BigNumber
// ): BigNumber {
//   if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
//     [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
//   }

//   return amount1
//     .multipliedBy(Q96)
//     .div(sqrtRatioBX96.minus(sqrtRatioAX96));
// }

// // Compute the maximum liquidity for given amounts of token0 and token1
// export function getLiquidityForAmounts(
//   sqrtRatioX96: BigNumber,
//   sqrtRatioAX96: BigNumber,
//   sqrtRatioBX96: BigNumber,
//   amount0: BigNumber,
//   amount1: BigNumber
// ): BigNumber {
//   if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
//     [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
//   }

//   if (sqrtRatioX96.lte(sqrtRatioAX96)) {
//     return getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
//   } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
//     const liquidity0 = getLiquidityForAmount0(
//       sqrtRatioX96,
//       sqrtRatioBX96,
//       amount0
//     );
//     const liquidity1 = getLiquidityForAmount1(
//       sqrtRatioAX96,
//       sqrtRatioX96,
//       amount1
//     );
//     return BigNumber.min(liquidity0, liquidity1);
//   } else {
//     return getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
//   }
// }

export function getPrice(sqrtPriceX96: bigint, decimal0: number, decimal1: number): { priceToken0InToken1: string, priceToken1InToken0: string } {
  const sqrtPriceBN = new BigNumber(sqrtPriceX96.toString());

  // Calculate the price of Token0 in terms of Token1
  const priceToken0InToken1 = sqrtPriceBN.div(Q96).pow(2).div(new BigNumber(10).pow(decimal1 - decimal0));

  // Calculate the price of Token1 in terms of Token0 (inverse of the above)
  const priceToken1InToken0 = new BigNumber(1).div(priceToken0InToken1);

  // Format prices for readability
  const priceToken0InToken1Formatted = priceToken0InToken1.toFixed(6);  // You can adjust decimal precision here
  const priceToken1InToken0Formatted = priceToken1InToken0.toFixed(6);  // You can adjust decimal precision here

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

export function tickToPrice(tick: number): number {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick)

  const ratioX192 = sqrtRatioX96 * sqrtRatioX96

  return new BigNumber(ratioX192.toString()).div(Q192).toNumber();
}

export function priceToClosestTick(price: number, tickSpacing: number): number {
  const { numerator, denominator } = toFraction(price);
  const sqrtRatioX96 = encodeSqrtRatioX96(numerator, denominator);

  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const nextTickPrice = tickToPrice(tick + 1);
  if (!(price < nextTickPrice)) {
    tick++
  }
  return closestTickToTick(tick, tickSpacing);
}

export function closestTickToTick(tick: number, tickSpacing: number): number {
  const minTick = getMinTick(tickSpacing);
  const maxTick = getMaxTick(tickSpacing);
  const tickWant = Math.floor(tick / tickSpacing) * tickSpacing;
  if (tickWant < minTick) {
    return minTick;
  }
  if (tickWant > maxTick) {
    return maxTick;
  }
  return tickWant;
}

// function getToken1Amount(
//   tickCurrent: number,
//   tickLower: number,
//   tickUpper: number,
//   sqrtRatioX96: bigint,
//   liquidity: bigint
// ): bigint {
//   if (tickCurrent < tickLower) {
//     return ZERO
//   }
//   if (tickCurrent < tickUpper) {
//     return SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false)
//   }
//   return SqrtPriceMath.getAmount1Delta(
//     TickMath.getSqrtRatioAtTick(tickLower),
//     TickMath.getSqrtRatioAtTick(tickUpper),
//     liquidity,
//     false
//   )
// }

export function maxLiquidityForAmount0Precise(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, amount0: BigintIsh): bigint {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }

  const numerator = BigInt(amount0) * sqrtRatioAX96 * sqrtRatioBX96
  const denominator = BigInt(Q96.toFixed()) * (sqrtRatioBX96 - sqrtRatioAX96)
  return numerator / denominator
}

export function maxLiquidityForAmount1(sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, amount1: BigintIsh): bigint {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }

  return (BigInt(amount1) * BigInt(Q96.toFixed())) / (sqrtRatioBX96 - sqrtRatioAX96)
}

export function calculateOtherAmount0(
  sqrtRatioAX96: bigint, // lower
  currentSqrtPriceX96: bigint, // current
  sqrtRatioBX96: bigint, // upper
  amount0: BigintIsh
): { amount: bigint; liquidity: bigint } {
  const liquidity = maxLiquidityForAmount0Precise(sqrtRatioBX96, currentSqrtPriceX96, amount0)
  const otherAmount1 = SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, currentSqrtPriceX96, liquidity, true);
  return { amount: otherAmount1, liquidity };
}

export function calculateOtherAmount1(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount1: BigintIsh
): { amount: bigint; liquidity: bigint } {
  const liquidity = maxLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1)
  const otherAmount0 = SqrtPriceMath.getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, true);
  return { amount: otherAmount0, liquidity };
}