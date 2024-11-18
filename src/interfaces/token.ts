export interface Token {
  id: number;
  type: string;
  address: string | null;
  name: string;
  symbol: string;
  description: string | null;
  image: string;
  decimals: number;
  aliased: boolean;
  price: string;
  source: {
    chain: string;
    address: string;
    bridge: string;
    symbol: string;
    name: string;
  } | null;
  balance?: string;
  value?: string;
}
