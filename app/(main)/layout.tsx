"use client";
import { LazorkitProvider } from "@lazorkit/wallet";
import React from "react";
import Appbar from "../components/Appbar";
import { Toaster } from "react-hot-toast";
export const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      <Toaster />
      <div className=" relative bg-linear-to-br from-black to-neutral-900 h-screen text-neutral-400 p-2 flex flex-col">
        <Appbar />
        {children}
      </div>
    </LazorkitProvider>
  );
};

export default MainLayout;
