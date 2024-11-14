import { useEffect, useState } from "react";
import { CounterContract } from "../contracts/CounterContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, fromNano, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useCounterContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    contract_balance: string;
  }>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new CounterContract(
      Address.parse("EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu")
    );
    return client.open(contract) as OpenedContract<CounterContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setContractData(null);
      const val = await counterContract.getData();
      const { number } = await counterContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
        contract_balance: fromNano(number),
      });
      await sleep(15000);
      getValue();
    }
    getValue();
  }, [counterContract]);

  return {
    value: contractData?.counter_value,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender, toNano(0.05), 3);
    },
    contract_balance: contractData?.contract_balance,
  };
}
