"use client";

import Providers from "@/components/providers";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { useEffect } from "react";

export default async function Page() {
  const { login } = usePrivy();
  const { wallets } = useWallets();
  //   console.log(wallets);
  //   const loginAndWin = async () => {
  //     const provider = await wallets[0].getEthersProvider();

  //     const signer = provider.getSigner();
  //     PushAPI.initialize(signer, {
  //       env: CONSTANTS.ENV.PROD,
  //     })
  //       .then((api) => api.info())
  //       .then(console.log);
  //   };

  useEffect(() => {
    login();

    console.log(wallets);
  }, [wallets]);

  return <></>;
}
