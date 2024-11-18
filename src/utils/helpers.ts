import { Token } from "@/dtos";

export const isNative = (token: Token) => token.type === "native";

export const toValue = (balance: string, decimals: number, price: string) => {
  const value = parseFloat(balance) * parseFloat(price);
  return value.toFixed(decimals);
};
