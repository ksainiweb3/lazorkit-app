"use client";

import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
import { useWallet } from "@lazorkit/wallet";
import {
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
const connection = new Connection("https://api.devnet.solana.com");
const Dashboard = () => {
  const { signAndSendTransaction, smartWalletPubkey, isSigning } = useWallet();

  const USDC_MINT = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  );

  const sendUsdc = async () => {
    if (!smartWalletPubkey) return;

    const from = new PublicKey(smartWalletPubkey);
    const to = from; // self for demo (safe)

    const fromAta = await getAssociatedTokenAddress(USDC_MINT, from);
    const toAta = await getAssociatedTokenAddress(USDC_MINT, to);

    const ix = createTransferCheckedInstruction(
      fromAta,
      USDC_MINT,
      toAta,
      from,
      100_000,
      6
    );

    const sig = await signAndSendTransaction({
      instructions: [ix],
    });

    console.log("USDC tx confirmed:", sig);
  };

  return (
    <button onClick={sendUsdc} disabled={isSigning}>
      {isSigning ? "Processing..." : "Pay 0.01 SOL"}
    </button>
  );
};

export default Dashboard;
