# Base Swap

A mobile-first web app for swapping tokens on **Base** using the Uniswap **Universal Router**. Built with Next.js + wagmi/viem so it can be opened as a normal site on an Android phone (installable as a PWA) or embedded in a wrapper later if you want a "real" app.

## Status

This is a working starter, not production-ready:

- Wallet connect (Coinbase Wallet, WalletConnect, injected) ✅
- Permit2 approval flow ✅
- Universal Router swap calldata builder (single-hop V3, exact-input) ✅
- **Missing:** live quotes/routing — `minAmountOut` is currently a placeholder `0n`, which means **no slippage protection**. Do not point this at real funds until you wire in a quote source (Uniswap Trading API, or run the Smart Order Router).

## Getting started

```bash
npm install
cp .env.example .env.local   # add a WalletConnect Cloud project ID: https://cloud.walletconnect.com
npm run dev
```

Open `http://localhost:3000` — on your phone, use your machine's LAN IP so mobile wallet deep-links work correctly.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial scaffold: Base swap app via Universal Router"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Open in StackBlitz

Once pushed, open it directly by visiting:

```
https://stackblitz.com/github/<your-username>/<repo-name>
```

StackBlitz will pull the repo and boot a dev server automatically (Next.js is supported natively via WebContainers).

## Project structure

```
app/              Next.js app router pages
components/       ConnectWallet, SwapWidget, Providers
lib/
  wagmi.ts        Chain + connector config (Base mainnet)
  addresses.ts    Universal Router / Permit2 / token addresses
  permit2.ts      Approval helpers
  buildSwap.ts    Universal Router calldata builder
```

## Next steps

1. Wire `buildV3ExactInputSwap` to a real quote (Trading API or SOR) so `minAmountOut` reflects actual slippage tolerance.
2. Add a token picker instead of the hardcoded USDC → WETH pair.
3. Consider Permit2 **signature-based** approval (EIP-712) instead of the on-chain `permit2.approve` call, to cut a transaction on mobile.
4. Add a PWA manifest (`app/manifest.ts`) so it can be "Added to Home Screen" on Android.
