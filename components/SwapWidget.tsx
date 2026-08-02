"use client";

import { useState } from "react";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi";
import { buildV3ExactInputSwap } from "@/lib/buildSwap";
import { buildErc20ApproveToPermit2, buildPermit2ApproveRouter } from "@/lib/permit2";
import { TOKENS } from "@/lib/addresses";

export function SwapWidget() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSwap() {
    if (!address || !amount) return;
    try {
      setStatus("Approving token spend...");
      await writeContractAsync(buildErc20ApproveToPermit2(TOKENS.USDC as `0x${string}`));

      setStatus("Granting router allowance...");
      await writeContractAsync(buildPermit2ApproveRouter(TOKENS.USDC as `0x${string}`));

      setStatus("Building swap...");
      // NOTE: minAmountOut below is a placeholder. In production, fetch a
      // live quote (e.g. from the Uniswap Trading API) and apply slippage
      // tolerance before setting this value — never default to 0n on mainnet.
      const tx = buildV3ExactInputSwap({
        tokenIn: TOKENS.USDC as `0x${string}`,
        tokenOut: TOKENS.WETH as `0x${string}`,
        amountIn: amount,
        amountInDecimals: 6,
        minAmountOut: 0n,
        recipient: address,
      });

      setStatus("Confirm swap in wallet...");
      const hash = await sendTransactionAsync(tx);
      setStatus(`Swap submitted: ${hash.slice(0, 10)}...`);
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "Swap failed");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-5">
      <div className="rounded-xl bg-black/30 p-4">
        <label className="text-xs text-white/50">You pay</label>
        <div className="flex items-center justify-between">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-2xl outline-none"
          />
          <span className="text-sm text-white/70">USDC</span>
        </div>
      </div>

      <div className="rounded-xl bg-black/30 p-4">
        <label className="text-xs text-white/50">You receive (estimated)</label>
        <div className="flex items-center justify-between">
          <span className="text-2xl text-white/40">–</span>
          <span className="text-sm text-white/70">WETH</span>
        </div>
      </div>

      <button
        onClick={handleSwap}
        disabled={!isConnected || !amount}
        className="w-full rounded-xl bg-blue-600 py-3 font-medium disabled:opacity-40"
      >
        {isConnected ? "Swap" : "Connect wallet to swap"}
      </button>

      {status && <p className="text-center text-xs text-white/50">{status}</p>}
    </div>
  );
}
