"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export const connection = new Connection("https://api.devnet.solana.com");
const PLAY_MINT = new PublicKey("BX19BZTcTKgHhQXRd2sotXnS31vw8yRGYgwijCCZvDAH");
const TREASURY = new PublicKey("8Gqi1cTceV53HnpBbsL7YVgJ6hcUS9AR4VLBEmtYf1Z5");

export default function Dashboard() {
  const { signAndSendTransaction, smartWalletPubkey, isSigning } = useWallet();

  const sendPlay = async () => {
    if (!smartWalletPubkey) return;

    const user = new PublicKey(smartWalletPubkey);

    const userAta = await getAssociatedTokenAddress(
      PLAY_MINT,
      user,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const treasuryAta = await getAssociatedTokenAddress(
      PLAY_MINT,
      TREASURY,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const ix = createTransferInstruction(
      userAta,
      treasuryAta,
      user,
      1_000_000_000, // 1 PLAY (9 decimals)
      [],
      TOKEN_2022_PROGRAM_ID
    );

    const tx = new Transaction().add(ix);
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    tx.lastValidBlockHeight = lastValidBlockHeight;
    tx.recentBlockhash = blockhash;

    const sig = await signAndSendTransaction(tx);
    console.log("PLAY spent:", sig);
  };

  return (
    <button onClick={sendPlay} disabled={isSigning}>
      {isSigning ? "Processing..." : "Play (1 PLAY)"}
    </button>
  );
}
