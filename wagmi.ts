"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

// Get a free project ID at https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "YOUR_WALLETCONNECT_PROJECT_ID";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    // Best for Android: Coinbase Wallet deep-links straight into the app
    coinbaseWallet({
      appName: "Base Swap",
      preference: "smartWalletOnly",
    }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
