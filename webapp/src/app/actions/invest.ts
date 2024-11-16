"use server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Address, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const invest = async (
  profile: number,
  wallet: string,
  amount: string,
  recurrency: number
) => {
  const db = new PrismaClient();

  await db.strategy.create({
    data: {
      risk: profile,
      amount: parseInt(amount),
      recurrency,
      privyID: wallet,
      name: "Risk " + profile,
    },
  });

  const account = privateKeyToAccount(process.env.FUNDER_WALLET as Address);

  const client = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  const topup = await client.sendTransaction({
    to: wallet as Address,
    amount: parseEther("0.0001"),
  });

  redirect("/deposit");
};
