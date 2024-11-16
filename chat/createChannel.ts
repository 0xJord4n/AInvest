import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { env } from "bun";
import { ethers } from "ethers";

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = new ethers.Wallet(env.PRIVATE_KEY as string);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const admin = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });

console.log("infos", await admin.info());
const response = await admin.channel.create({
  name: "AInvest",
  description: "AInvest",
  icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
  url: "https://ainvest.money",
});

console.log(response);
