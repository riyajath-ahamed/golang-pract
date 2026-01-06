import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { system } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <AnalyticsProvider>
        <App />
      </AnalyticsProvider>
    </ChakraProvider>
  </StrictMode>
);
