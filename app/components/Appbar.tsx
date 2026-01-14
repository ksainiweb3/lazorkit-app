"use client";

import { useWallet } from "@lazorkit/wallet";
import { PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useEffect, useState } from "react";
import { MINT } from "../api/mint/route";
import { connection } from "../(main)/dashboard/page";
import { LoaderIcon } from "react-hot-toast";

export default function Appbar() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [roseTokenBalance, setRoseTokenBalance] = useState<number | null>(null);

  async function handleMint() {
    setIsMinting(true);
    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({ userPubkey: wallet?.smartWallet }),
      });
      const jsonRes = await res.json();
      console.log(jsonRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsMinting(false);
    }
  }

  useEffect(() => {
    if (!isConnected || !wallet?.smartWallet) return;
    const fetchRoseBalance = async () => {
      try {
        const smartWalletPubkey = new PublicKey(wallet.smartWallet);
        const userAta = await getAssociatedTokenAddress(
          MINT,
          smartWalletPubkey,
          true,
          TOKEN_2022_PROGRAM_ID
        );

        const tokenAccount = await getAccount(
          connection,
          userAta,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );

        const balance = Number(tokenAccount.amount) / 1_000_000_000;
        setRoseTokenBalance(balance);
      } catch (err) {
        setRoseTokenBalance(0);
      }
    };

    fetchRoseBalance();
  }, [isConnected, wallet?.smartWallet, isMinting]);

  return (
    <div
      className="px-6 py-3 bg-linear-to-r from-neutral-950 to-neutral-800
      md:w-6xl w-md mx-auto flex md:h-20 h-15 items-center justify-between rounded-b-lg"
    >
      <div className="text-2xl font-semibold">Keyless</div>

      <div className="items-center space-x-4 hidden md:block">
        {wallet?.smartWallet ? (
          <>
            <span>
              {wallet.smartWallet.slice(0, 4)}...
              {wallet.smartWallet.slice(-4)}
            </span>

            {roseTokenBalance !== null && (
              <>
                <span>|</span>
                <span>ROSE: {roseTokenBalance}</span>
                <span>|</span>
                <button
                  className="bg-linear-to-r from-neutral-900 to-black px-3 py-1 rounded-lg cursor-pointer"
                  onClick={handleMint}
                  disabled={isMinting}
                >
                  {isMinting ? <LoaderIcon /> : "Mint"}
                </button>
              </>
            )}

            <button
              className="text-red-500 hover:underline ml-4"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => connect({ feeMode: "paymaster" })}
            disabled={isConnecting}
            className="bg-neutral-900 p-2 rounded-md"
          >
            {isConnecting ? "Connecting..." : "Connect Smart Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}
