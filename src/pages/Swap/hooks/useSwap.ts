import { useJettonWallet } from "@/hooks/useJettonWallet"

export const useSwap = (token0: string, token1: string) => {
    const { jettonMinter: jettonMinter0, jettonWallet: jettonWallet0 } = useJettonWallet(token0);
    const { jettonMinter: jettonMinter1, jettonWallet: jettonWallet1 } = useJettonWallet(token1);
}