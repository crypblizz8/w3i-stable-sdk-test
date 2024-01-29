import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { mainnet } from "wagmi/chains";
import { initWeb3InboxClient } from "@web3inbox/react";

const chains = [mainnet];

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

// W3Inbox Setup
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

initWeb3InboxClient({
  projectId,
  domain: appDomain,
  allApps: process.env.NODE_ENV !== "production",
});

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}
    </>
  );
}
