"use client";

import { useWallet } from "@lazorkit/wallet";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

const Dashboard = () => {
  const { signAndSendTransaction, smartWalletPubkey, isSigning } = useWallet();

  const sendSol = async () => {
    console.log("Secure:", window.isSecureContext);

    if (!smartWalletPubkey) {
      alert("Wallet not connected");
      return;
    }

    const from = new PublicKey(smartWalletPubkey);
    const to = new PublicKey("28fjzWdBmJ83stkto9yGitXFhuqHGYqxZxPPciLDKzzL");

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: 1_000,
      })
    );

    tx.feePayer = from;

    const { blockhash } = await connection.getLatestBlockhash("finalized");
    tx.recentBlockhash = blockhash;

    const sig = await signAndSendTransaction(tx);

    console.log("Transaction signature:", sig);
  };

  return (
    <button onClick={async () => await sendSol()} disabled={isSigning}>
      {isSigning ? "Processing..." : "Pay 0.001 SOL"}
    </button>
  );
};

export default Dashboard;
