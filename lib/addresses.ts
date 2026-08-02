// Base mainnet (chainId 8453) addresses
// Source: https://docs.uniswap.org/contracts/v3/reference/deployments/base-deployments

// Verified against basescan.org/address/0x6ff5693b99212da76ad316178a184ab56d299b43 (Universal Router V2.0)
export const UNIVERSAL_ROUTER_ADDRESS =
  "0x6ff5693b99212da76ad316178a184ab56d299b43" as const;

export const PERMIT2_ADDRESS =
  "0x000000000022D473030F116dDEE9F6B43aC78BA" as const;

export const TOKENS = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
} as const;

export const BASE_CHAIN_ID = 8453;
