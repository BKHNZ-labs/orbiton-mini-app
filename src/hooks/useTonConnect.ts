import { useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { address, Sender, SenderArguments } from "ton-core";

export function useTonConnect(): { sender: Sender; } {
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (tonConnectUI.connected) {
      
    }
  }, [tonConnectUI]);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });
      },
      address: tonConnectUI.account ? address(tonConnectUI.account.address) : undefined,
    }
  };
}
