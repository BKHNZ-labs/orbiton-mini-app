import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { TonClient } from "@ton/ton";

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: "https://magical-young-wind.ton-mainnet.quiknode.pro/a352ba98c355055971794805357acbef7c037409/jsonRPC",

      })
  );
}
