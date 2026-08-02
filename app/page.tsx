import { ConnectWallet } from "@/components/ConnectWallet";
import { SwapWidget } from "@/components/SwapWidget";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-8">
      <h1 className="text-center text-lg font-semibold">Base Swap</h1>
      <ConnectWallet />
      <SwapWidget />
    </main>
  );
}
