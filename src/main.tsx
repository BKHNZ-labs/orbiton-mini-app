import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// this manifest is used temporarily for development purposes
const manifestUrl =
  "https://raw.githubusercontent.com/BKHNZ-labs/orbiton-mini-app/main/public/manifest.json";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl} restoreConnection={true} actionsConfiguration={
    {
      modals: "all",
      notifications: "all",
    }
  }>
    <App />
  </TonConnectUIProvider>
);
