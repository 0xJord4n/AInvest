import { describe, it, expect, beforeEach } from "vitest";
import app from "../src";
import { RedPillAI } from "../src/services/redpill";

describe("Chatbot Functionality", () => {
  beforeEach(() => {
    // Reset environment for each test
    const secrets = require("../secrets/default.json");
  });

  it("should handle successful chat requests", async () => {
    const res = await app.request("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "What is the current market sentiment?",
        model: "gpt-4o",
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("response");
  });

  it("should handle invalid request body", async () => {
    const res = await app.request("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{invalid json}",
    });

    expect(res.status).toBe(500);
  });
});
