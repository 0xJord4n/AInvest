import { Hono } from "hono";
import { RedPillAI } from "./services/redpill";
import { TransactionHandler } from "./services/transactions";
import { TappdClient } from '@phala/dstack-sdk';
import 'dotenv/config';

const app = new Hono();

// Initialize services
const redPillService = new RedPillAI();
const transactionService = new TransactionHandler();

// Initialize TappdClient
const endpoint = process.env.DSTACK_SIMULATOR_ENDPOINT || 'http://localhost:8090';
const tappdClient = new TappdClient(endpoint);

app.get("/", async (c) => {
  // Basic health check
  return c.json({ status: "ok" });
});

// AI Chat endpoint
app.post("/chat", async (c) => {
  let vault: Record<string, string> = {};
  let derivedKey;
  try {
    // Derive a key for the chat endpoint
    derivedKey = await tappdClient.deriveKey("/chat", "secure-chat");
    vault = JSON.parse(process.env.secret || "{}");
  } catch (e) {
    console.error("Failed to parse secrets or derive key:", e);
    return c.json({ error: "Failed to initialize secure context" }, 500);
  }

  const apiKey = vault.REDPILL_API_KEY || "";
  if (!apiKey) {
    return c.json({ error: "API key not configured" }, 401);
  }

  try {
    const body = await c.req.json();
    const { message, model = "gpt-4" } = body;

    const response = await redPillService.chat({
      message,
      model,
      apiKey,
    });

    return c.json({ 
      response,
      derivedKey: derivedKey.asUint8Array(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ error: "Failed to process chat request" }, 500);
  }
});

// Transaction endpoints
app.post("/transaction", async (c) => {
  try {
    const derivedKey = await tappdClient.deriveKey("/transaction", "secure-tx");
    const result = await transactionService.handleTransaction(c);
    // Merge the transaction result with derivedKey
    return c.json({
      ...result,
      derivedKey: derivedKey.asUint8Array(),
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return c.json({ error: "Failed to process transaction" }, 500);
  }
});

app.post("/sign", async (c) => {
  try {
    const derivedKey = await tappdClient.deriveKey("/sign", "secure-sign");
    const body = await c.req.json();
    body.type = "sign";
    const result = await transactionService.handleTransaction(c);
    return c.json({
      ...result,
      derivedKey: derivedKey.asUint8Array(),
    });
  } catch (error) {
    console.error("Sign error:", error);
    return c.json({ error: "Failed to process sign request" }, 500);
  }
});

export default app;
