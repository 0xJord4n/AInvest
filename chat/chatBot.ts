import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { env } from "bun";
import { ethers } from "ethers";

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = new ethers.Wallet(env.PRIVATE_KEY as string);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userChat = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });

// This will be the wallet address of the recipient
const pushAIWalletAddress = "0x1814b7a2a132a816fF5Bd8573b1C2Bf5995d2FdA";

// IMPORTANT: Setup stream events before stream.connect()
// Checkout all chat stream listen options - https://push.org/docs/chat/build/stream-chats/
const stream = await userChat.initStream([
  CONSTANTS.STREAM.CHAT,
  CONSTANTS.STREAM.CONNECT,
  CONSTANTS.STREAM.DISCONNECT,
]);

// Setup responder for CONSTANTS.STREAM.CONNECT event
stream.on(CONSTANTS.STREAM.CONNECT, () => {
  console.log("Stream Connected");

  // Send a message to Bob after socket connection so that messages as an example
  console.log("Sending message to PushAI Bot");
  userChat.chat.send(pushAIWalletAddress, {
    content: "Gm gm! It's a me... Mario",
  });
});

// Setup responder for CONSTANTS.STREAM.DISCONNECT event
stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.log("Stream Disconnected");
});

// Setup responder for CONSTANTS.STREAM.CHAT event
// React to message payload getting recieved
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log("Message Received");
  console.log(message);
  if (message.origin === "self") {
    console.log(
      "Message sent by your wallet, please wait for few moments for PushAI response"
    );
  }
  if (message.origin === "other") {
    console.log("Message received by PushAI.eth");
  }
});

// now that response logic for streams are setup
// finally connect stream
await stream.connect();
