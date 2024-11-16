import { TonConnectButton } from "@tonconnect/ui-react";
import "./App.css";
import { Button } from "@/components/ui/button";
import WebApp from "@twa-dev/sdk";
import { useCounterContract } from "./hooks/useCounterContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const { address, value, sendIncrement, contract_balance } =
    useCounterContract();

  const { connected } = useTonConnect();

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <>
      <div>
        <Button>Click me</Button>
      </div>

      <div>
        <TonConnectButton />
      </div>

      <div>
        <div className="Card">
          <b>{WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className="Hint">{address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance}</div>
        </div>
        <div className="Card">
          <b>Counter Value</b>
          <div>{value ?? "Loading..."}</div>
        </div>

        <a
          onClick={() => {
            showAlert();
          }}
        >
          Show Alert
        </a>

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
    </>
  );
}

export default App;
