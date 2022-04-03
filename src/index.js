import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "rsuite/dist/rsuite.min.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <MoralisProvider
    serverUrl="https://llzamstaxpn8.usemoralis.com:2053/server"
    appId="Tg1KC5znzfMweM3PQzHhIWsDpKJgfHYsTcU59yLR"
  >
    <App />
  </MoralisProvider>
);
