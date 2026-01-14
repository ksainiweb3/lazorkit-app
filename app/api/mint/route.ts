import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

const connection = new Connection("https://api.devnet.solana.com");

const MINT_AUTHORITY = Keypair.fromSecretKey(
  Uint8Array.from([
    91, 114, 62, 120, 169, 227, 201, 213, 176, 76, 83, 191, 244, 12, 133, 243,
    253, 28, 20, 20, 212, 19, 11, 144, 114, 138, 192, 141, 173, 61, 15, 60, 26,
    87, 198, 46, 224, 15, 82, 118, 162, 108, 236, 34, 53, 196, 185, 92, 100,
    101, 26, 183, 72, 86, 193, 247, 10, 241, 171, 211, 11, 0, 231, 124,
  ])
);

export const MINT = new PublicKey(
  "BX19BZTcTKgHhQXRd2sotXnS31vw8yRGYgwijCCZvDAH"
);

export async function POST(req: NextRequest) {
  try {
    const { userPubkey } = await req.json();
    console.log(userPubkey);
    const user = new PublicKey(userPubkey);

    const userAta = await getAssociatedTokenAddress(
      MINT,
      user,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const tx = new Transaction();

    const ataInfo = await connection.getAccountInfo(userAta);
    if (!ataInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          MINT_AUTHORITY.publicKey,
          userAta,
          user,
          MINT,
          TOKEN_2022_PROGRAM_ID
        )
      );
    }

    tx.add(
      createMintToInstruction(
        MINT,
        userAta,
        MINT_AUTHORITY.publicKey,
        1_000_000_000_000,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [
      MINT_AUTHORITY,
    ]);

    return NextResponse.json({
      success: true,
      signature: sig,
      ata: userAta.toBase58(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Mint failed" }, { status: 500 });
  }
}
