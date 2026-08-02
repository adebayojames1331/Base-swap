import { erc20Abi, type Address, maxUint160, maxUint256 } from "viem";
import { PERMIT2_ADDRESS, UNIVERSAL_ROUTER_ADDRESS } from "./addresses";

/**
 * Two-step allowance flow required before a Universal Router swap:
 * 1. token.approve(Permit2, maxUint256) — one-time per token, standard ERC20 approval
 * 2. permit2.approve(token, UniversalRouter, amount, expiration) — grants the
 *    router a time-boxed allowance via Permit2
 *
 * Step 2 can alternatively be done gaslessly via an EIP-712 signature
 * (see Uniswap's permit2-sdk `AllowanceTransfer.getPermitData`), which is
 * the better UX for mobile since it avoids a second on-chain tx.
 */

export function buildErc20ApproveToPermit2(token: Address) {
  return {
    address: token,
    abi: erc20Abi,
    functionName: "approve" as const,
    args: [PERMIT2_ADDRESS, maxUint256] as const,
  };
}

const PERMIT2_APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "spender", type: "address" },
      { name: "amount", type: "uint160" },
      { name: "expiration", type: "uint48" },
    ],
    outputs: [],
  },
] as const;

export function buildPermit2ApproveRouter(token: Address, expirySeconds = 60 * 60 * 24 * 30) {
  const expiration = Math.floor(Date.now() / 1000) + expirySeconds;
  return {
    address: PERMIT2_ADDRESS,
    abi: PERMIT2_APPROVE_ABI,
    functionName: "approve" as const,
    args: [token, UNIVERSAL_ROUTER_ADDRESS, maxUint160, expiration] as const,
  };
}
