import { FeeAmount } from "@/interfaces/fee";

export const ROUTER_ADDRESS =
  "EQCd7PEDfRURTY3yb5WXn8rN56oH-OPkmyK4xRRbVL-Mh9xE";

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
