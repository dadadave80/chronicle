"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import {
  hederaMainnet,
  hederaPreviewnet,
  hederaTestnet,
} from "@/config/chains";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction
  ? "https://chronify-s.vercel.app/"
  : `http://localhost:${process.env.PORT || 3000}`;

// Set up metadata
const metadata = {
  name: "Chronify",
  description: "Supply Chain Management on Hedera",
  url: baseUrl,
  icons: [`${baseUrl}/favicon-32x32.png`],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [hederaPreviewnet, hederaTestnet, hederaMainnet],
  defaultNetwork: hederaPreviewnet,
  metadata: metadata,
  features: {
    analytics: true,
    swaps: true,
    onramp: true,
    email: true,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#000000E5",
    "--w3m-border-radius-master": "1px",
    "--w3m-font-size-master": "9px",
    "--w3m-z-index": 9999,
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
