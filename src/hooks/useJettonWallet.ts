import { JettonMinterWrapper } from "orbiton-contracts-sdk";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "@ton/core";

export const useJettonWallet = (address: string) => {
    const client = useTonClient();
    const { sender } = useTonConnect();

    const jettonMinter = useAsyncInitialize(async () => {
        if (!client || !address) return null;
        const contract = new JettonMinterWrapper.JettonMinter(
            Address.parse(address)
        );

        return client.open(
            contract
        ) as OpenedContract<JettonMinterWrapper.JettonMinter>;
    }, [client, address]);

    const jettonWallet = useAsyncInitialize(async () => {
        if (!jettonMinter) return null;
        return jettonMinter.getWalletAddress(sender.address!);
    }, [jettonMinter]);

    return {
        jettonWallet,
        jettonMinter
    }
}