import { Address, Sender, SenderArguments } from "@ton/core";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export function useTonConnect(): { sender: Sender } {
  const [tonConnectUI] = useTonConnectUI();
  const addressTon = useTonAddress();
  const [address, setAddress] = useState<Address | undefined>(undefined);

  useEffect(() => {
    (async () => {
      console.log("addressTon", addressTon);
      console.log(tonConnectUI);
      if (!tonConnectUI) return;
      if ((await tonConnectUI.connectionRestored) || tonConnectUI.connected) {
        console.log("go here"); 
        if (tonConnectUI.account) {
          setAddress(Address.parse(tonConnectUI.account?.address));
        }
      }
    })();
  }, [tonConnectUI, addressTon]);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        try {
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
        } catch (e) {
          console.error(e);
        }
      },
      address,
    },
  };
}
