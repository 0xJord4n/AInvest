import { Hono } from "hono";
import { RedPillAI } from "./services/redpill";
import { TransactionHandler } from "./services/transactions";
import { handle } from "@phala/wapo-env/guest";

const app = new Hono();

// Initialize services
const redPillService = new RedPillAI();
const transactionService = new TransactionHandler();

app.get("/", async (c) => {
  // Basic health check
  return c.json({ status: "ok" });
});

// AI Chat endpoint
app.post("/chat", async (c) => {
  let vault: Record<string, string> = {};
  try {
    vault = JSON.parse(process.env.secret || "{}");
  } catch (e) {
    console.error("Failed to parse secrets:", e);
    return c.json({ error: "Failed to parse secrets" }, 500);
  }

  const apiKey = vault.REDPILL_API_KEY || "";
  if (!apiKey) {
    return c.json({ error: "API key not configured" }, 401);
  }

  try {
    const body = await c.req.json();
    const { message, model = "gpt-4o" } = body;

    const response = await redPillService.chat({
      message,
      model,
      apiKey,
    });

    return c.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ error: "Failed to process chat request" }, 500);
  }
});

// Transaction endpoints
app.post("/transaction", async (c) => {
  return await transactionService.handleTransaction(c);
});

app.post("/sign", async (c) => {
  const body = await c.req.json();
  body.type = "sign";
  return await transactionService.handleTransaction(c);
});

export default app;
