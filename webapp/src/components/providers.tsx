"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm3ivfv2c037nptk4s28yyxhv"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://github.com/0xJord4n/AInvest/blob/main/webapp/src/public/logo/logo.png?raw=true",
        },
        loginMethods: ["email", "wallet", "google", "apple", "twitter"],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
