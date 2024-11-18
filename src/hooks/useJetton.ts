import { useEffect } from "react";
import TonWeb from "tonweb";

// const CONTENT_URI = "https://raw.githubusercontent.com/tonkeeper/ton-assets/main/jettons.json";

export function useJetton() {
  useEffect(() => {
    (async () => {
      const tonweb = new TonWeb();
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(
        tonweb.provider,
        {
          adminAddress: new TonWeb.Address(
            "0:65aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf9208"
          ),
          jettonContentUri: "",
          jettonWalletCodeHex: TonWeb.token.jetton.JettonWallet.codeHex
        }
      );
      const data = await jettonMinter.getJettonData();
      console.log("Total supply:", data.totalSupply.toString());
      console.log("URI to off-chain metadata:", data.jettonContentUri);
    })();
  }, []);
}
