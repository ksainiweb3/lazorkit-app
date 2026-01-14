"use client";

import { useWallet } from "@lazorkit/wallet";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const PLAY_MINT = new PublicKey("BX19BZTcTKgHhQXRd2sotXnS31vw8yRGYgwijCCZvDAH");

const TREASURY = new PublicKey("8Gqi1cTceV53HnpBbsL7YVgJ6hcUS9AR4VLBEmtYf1Z5");

export default function Dashboard() {
  const { signAndSendTransaction, smartWalletPubkey, isSigning } = useWallet();

  const sendPlay = async () => {
    if (!smartWalletPubkey) return;

    const user = new PublicKey(smartWalletPubkey);

    // User ATA (smart wallet PDA → allow off-curve)
    const userAta = await getAssociatedTokenAddress(
      PLAY_MINT,
      user,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    // Treasury ATA (normal keypair → off-curve NOT allowed)
    const treasuryAta = await getAssociatedTokenAddress(
      PLAY_MINT,
      TREASURY,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const ix = createTransferInstruction(
      userAta,
      treasuryAta,
      user, // authority = smart wallet PDA
      1_000_000_000, // 1 PLAY (9 decimals)
      [],
      TOKEN_2022_PROGRAM_ID
    );

    const sig = await signAndSendTransaction({
      instructions: [ix],
      transactionOptions: {
        feeToken: undefined,
      },
    });

    console.log("PLAY spent:", sig);
  };

  return (
    <button onClick={sendPlay} disabled={isSigning}>
      {isSigning ? "Processing..." : "Play (1 PLAY)"}
    </button>
  );
}
