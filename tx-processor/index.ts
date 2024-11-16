import { PrivyClient, type WalletWithMetadata } from "@privy-io/server-auth";
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  http,
  maxUint256,
  parseEther,
  toHex,
  type Address,
  type Hex,
} from "viem";
import { base } from "viem/chains";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const walletClient = createWalletClient({
  chain: base,
  transport: http("https://1rpc.io/base"),
});

const publicClient = createPublicClient({
  chain: base,
  transport: http("https://1rpc.io/base"),
});

const privy = new PrivyClient(
  "cm3ivfv2c037nptk4s28yyxhv",
  "5qixSZZjftkjpFhYQtoKuD1eeGuhFzPkxUWDsorgex6KKaNmFc2mCYH4z47FUTZgXB6UmLWUwnDpo6y1J59jfzW7",
  {
    walletApi: {
      authorizationPrivateKey:
        "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgTEFuK2ivk6HXlSOsEF5HtAXlsjJRm+R3FUJpc+pDk5ihRANCAAR94VxYLqH5TGCB3wmAuHs77SI8CdicMBb3Yh23VBh6PqVjCD38mE30j4BGvNbWMkt9rBXRjg4oQiJumLm7sWP7",
    },
  }
);

const sendTransaction = async (
  account: Address,
  to: Address,
  value: bigint,
  data: Hex = "0x"
) => {
  const gas = await publicClient.estimateGas({
    account,
    to,
    value,
    data,
  });
  const gasPrice = await publicClient.getGasPrice();
  const { maxFeePerGas, maxPriorityFeePerGas } =
    await publicClient.estimateFeesPerGas();
  const nonce = await publicClient.getTransactionCount({
    address: account,
  });

  const { data: rawSig } = await privy.walletApi.rpc({
    address: account,
    chainType: "ethereum",
    method: "eth_signTransaction",
    params: {
      transaction: {
        to: to,
        value: toHex(value),
        chainId: 8453,
        gasLimit: toHex(gas * 2n),
        gasPrice: toHex(gasPrice),
        data,
        maxFeePerGas: toHex(maxFeePerGas),
        maxPriorityFeePerGas: toHex(maxPriorityFeePerGas),
        nonce,
      },
    },
  });

  const signedTransaction = rawSig.signedTransaction;

  const tx = await walletClient.sendRawTransaction({
    serializedTransaction: signedTransaction as Hex,
  });

  return tx;
};

const buildTx = async (
  fromToken: Address,
  toToken: Address,
  amount: bigint,
  sender: Address
) => {
  try {
    const response = await axios.get<{
      dstAmount: string;
      tx: {
        from: string;
        to: string;
        data: string;
        value: string;
        gas: number;
        gasPrice: string;
      };
    }>("https://api.1inch.dev/swap/v6.0/8453/swap", {
      headers: { Authorization: "Bearer 0osOjBZYxF8ggdzjWf0DJHk38tidsEB8" },
      params: {
        src: fromToken,
        dst: toToken,
        amount: amount.toString(),
        from: sender,
        origin: sender,
        slippage: "3",
        allowPartialFill: "false",
        disableEstimate: "true",
        usePermit2: "false",
      },
      paramsSerializer: { indexes: null },
    });

    return response.data.tx;
  } catch (e) {
    console.error(e);
  }
};

const db = new PrismaClient();

while (true) {
  console.log("Checking for trades to process");
  const needDCA = await db.strategy.findMany({
    where: {
      OR: [{ nextTrade: { lte: new Date() } }, { nextTrade: null }],
    },
  });
  console.log("Found", needDCA.length, "trades to process");

  for (const strategy of needDCA) {
    const account = strategy.privyID as Address;
    console.log("Trading for", account);

    try {
      const fromToken = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" as Address;
      const toToken = "0x940181a94a35a4569e4529a3cdfb74e38fd98631" as Address;
      const amount = 100n;
      if (fromToken != "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        const allowance = await publicClient.readContract({
          abi: erc20Abi,
          address: fromToken,
          functionName: "allowance",
          args: [
            account as Address,
            "0x111111125421ca6dc452d289314280a0f8842a65",
          ],
        });
        if (allowance < amount) {
          const tx = await sendTransaction(
            account as Address,
            fromToken,
            0n,
            encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [
                "0x111111125421ca6dc452d289314280a0f8842a65",
                maxUint256cle,
              ],
            })
          );

          console.log("Approving", tx);
          await publicClient.waitForTransactionReceipt({ hash: tx });
          console.log("Approved", tx);
        }
      }

      const swapData = await buildTx(fromToken, toToken, amount, account);

      const tx = await sendTransaction(
        account,
        "0x111111125421ca6dc452d289314280a0f8842a65",
        BigInt(swapData.value),
        swapData.data as Hex
      );

      console.log("Trading", tx);
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log("Traded", tx);

      await db.strategy.update({
        where: {
          id: strategy.id,
        },
        data: {
          nextTrade: new Date(Date.now() + strategy.recurrency * 1000),
        },
      });
    } catch (e) {
      console.error("Transaction failed", e);
    }
  }
}
