"use client";

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

  const sendSol = async () => {
    console.log("Secure:", window.isSecureContext);

    if (!smartWalletPubkey) {
      alert("Wallet not connected");
      return;
    }
    const from = new PublicKey(smartWalletPubkey);
    const to = new Keypair();

    const instruction = SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });

    console.log("Instruction " + instruction);
    const signature = await signAndSendTransaction({
      instructions: [instruction],
    });
    console.log("Transaction confirmed:", signature);
  };

  return (
    <button onClick={async () => await sendSol()} disabled={isSigning}>
      {isSigning ? "Processing..." : "Pay 0.01 SOL"}
    </button>
  );
};

export default Dashboard;
