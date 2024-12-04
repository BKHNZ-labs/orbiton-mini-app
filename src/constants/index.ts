import { FeeAmount } from "@/interfaces/fee";

export const ROUTER_ADDRESS =
  "EQCqQgmHCjGRumLtVZXoZz-4n7Zxa1BNZ673eCbCy3B9X-rL";

export const FEE_MAP = [
  {
    value: FeeAmount.VERY_LOW,
    label: "Very Low",
    tickSpacing: 1,
    friendlyValue: "0.01",
  },
  {
    value: FeeAmount.LOW,
    label: "Low",
    tickSpacing: 10,
    friendlyValue: "0.05",
  },
  {
    value: FeeAmount.MEDIUM,
    label: "Medium",
    tickSpacing: 60,
    friendlyValue: "0.3",
  },
  {
    value: FeeAmount.HIGH,
    label: "High",
    tickSpacing: 200,
    friendlyValue: "1",
  },
];
