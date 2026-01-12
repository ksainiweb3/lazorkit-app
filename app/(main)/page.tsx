"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWallet } from "@lazorkit/wallet";

const LandingPage = () => {
  const router = useRouter();
  const { isConnected } = useWallet();
  return (
    <div
      className="flex md:w-6xl w-md mx-auto 
      text-white pt-10 pb-4 h-screen justify-between items-center flex-col "
    >
      <div className="max-w-6xl mx-auto text-center flex flex-col justify-center items-center pt-10">
        <h1 className="text-6xl md:text-6xl font-bold leading-tight py-2">
          Play on Solana <br />
          without wallet popups
        </h1>

        <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto text-center">
          Passkey-powered smart wallets let you play games with seamless,
          <br />
          gasless micro-payments.
        </p>

        {isConnected && (
          <button
            className="bg-neutral-900 px-6 py-3 rounded-lg
          hover:bg-neutral-800 transition mb-8 text-xl cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            {`Dashboard ->`}
          </button>
        )}
      </div>
      <div>
        <div className="flex gap-4 justify-center py-4">
          <Image
            alt="LazorKit"
            src="/lk-logo.png"
            width={35}
            height={35}
            className="rounded-full "
          />
          <Image
            alt="Solana"
            src="/sol-logo.png"
            width={35}
            height={35}
            className="rounded-full scale-125"
          />
        </div>
        <p className="text-sm text-slate-500 text-center">
          Passkeys + smart wallets
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
