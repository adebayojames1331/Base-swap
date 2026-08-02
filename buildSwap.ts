import { CommandType, RoutePlanner } from "@uniswap/universal-router-sdk";
import { type Address, encodeFunctionData, parseUnits } from "viem";
import { PERMIT2_ADDRESS, UNIVERSAL_ROUTER_ADDRESS } from "./addresses";

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string; // human readable, e.g. "1.5"
  amountInDecimals: number;
  minAmountOut: bigint; // computed from a quote with slippage applied
  recipient: Address;
  /** True if tokenIn is native ETH */
  isNativeIn?: boolean;
}

/**
 * Builds calldata for a single-hop V3 exact-input swap through the
 * Universal Router. Assumes Permit2 allowance has already been granted
 * (see lib/permit2.ts) for ERC20 inputs.
 *
 * This is a starting template — for production use, fetch the actual
 * route/quote from the Uniswap Trading API or Smart Order Router rather
 * than assuming a single V3 pool.
 */
export function buildV3ExactInputSwap(params: SwapParams) {
  const { tokenIn, tokenOut, amountIn, amountInDecimals, minAmountOut, recipient, isNativeIn } =
    params;

  const amountInWei = parseUnits(amountIn, amountInDecimals);
  const planner = new RoutePlanner();

  // Encode path for a single 0.3% fee tier pool (adjust fee tier per actual pool)
  const feeTier = 3000;
  const path = encodePath([tokenIn, tokenOut], [feeTier]);

  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
    recipient,
    amountInWei,
    minAmountOut,
    path,
    !isNativeIn, // payerIsUser: true when funds come from the caller's Permit2 balance
  ]);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 min

  return {
    to: UNIVERSAL_ROUTER_ADDRESS as Address,
    value: isNativeIn ? amountInWei : 0n,
    data: encodeUniversalRouterExecute(planner, deadline),
  };
}

function encodePath(tokens: Address[], fees: number[]): `0x${string}` {
  let path = tokens[0].toLowerCase();
  for (let i = 0; i < fees.length; i++) {
    path += fees[i].toString(16).padStart(6, "0");
    path += tokens[i + 1].toLowerCase().slice(2);
  }
  return path as `0x${string}`;
}

function encodeUniversalRouterExecute(planner: RoutePlanner, deadline: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: "execute",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { name: "commands", type: "bytes" },
          { name: "inputs", type: "bytes[]" },
          { name: "deadline", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "execute",
    args: [planner.commands as `0x${string}`, planner.inputs as `0x${string}`[], deadline],
  });
}

export { PERMIT2_ADDRESS };
