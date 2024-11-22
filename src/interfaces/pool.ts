import { FeeAmount } from "./fee";
import { Token } from "./token";

export type Pool = {
  id: number;
  address: string;
  token0: Token;
  token1: Token;
  token0Amount: string;
  token1Amount: string;
  tvl: string;
  volume: string;
  fees: string;
  apr: string;
  friendlyFee: FeeAmount;
  fee: number;
  tickSpacing: number;
};
