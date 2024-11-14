import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "./hooks/useCounterContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const { address, value, sendIncrement, contract_balance } =
    useCounterContract();

  const { connected } = useTonConnect();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{value ?? "Loading..."}</div>
        </div>

        <div className="Card">
          {connected && (
            <a
              onClick={() => {
                sendIncrement();
              }}
            >
              Increment
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
