import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { env } from "bun";
import { ethers } from "ethers";

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = new ethers.Wallet(env.PRIVATE_KEY as string);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const admin = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

const response = await admin.channel.send(
  ["0x1814b7a2a132a816fF5Bd8573b1C2Bf5995d2FdA"],
  { notification: { title: "Hello", body: "World" } }
);

console.log("Notification sent: ", response.status == 200);
