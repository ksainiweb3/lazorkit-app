"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
const connection = new Connection("https://api.devnet.solana.com");

const Appbar = () => {
  const { connect, isConnected, isConnecting, wallet, disconnect } =
    useWallet();
  const [balance, setBalance] = useState<null | number>(null);

  useEffect(() => {
    (async function () {
      if (!isConnected || !wallet) return;
      const bal = await connection.getBalance(
        new PublicKey(wallet?.smartWallet)
      );
      setBalance(bal / LAMPORTS_PER_SOL);
    })();
  }, [isConnected, wallet]);
  console.log(wallet);

  return (
    <div
      className="px-6 py-3 bg-linear-to-r from-neutral-950 to-neutral-800 relative
     md:w-6xl w-md mx-auto flex md:h-20 h-15 items-center justify-between rounded-b-lg"
    >
      <div className="text-2xl font-semibold flex-1 text-center md:text-left ">
        Keyless
      </div>

      <div className="items-center space-x-4 hidden md:block">
        {wallet?.smartWallet ? (
          <>
            <span className="cursor-pointer">
              Account: {wallet.smartWallet.slice(0, 4)}...
              {wallet.smartWallet.slice(-4)}
            </span>
            <span>|</span>

            {balance !== null && (
              <>
                <span>Balance: {balance.toFixed(4)} SOL</span>
                <span>|</span>
              </>
            )}
            <button
              className="text-red-500 hover:underline hover:cursor-pointer"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => connect({ feeMode: "paymaster" })}
            disabled={isConnecting}
            className="bg-linear-to-r to-neutral-950 from-neutral-900 p-2 rounded-md cursor-pointer"
          >
            {isConnecting ? "Connecting..." : "Connect Smart Wallet"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Appbar;
