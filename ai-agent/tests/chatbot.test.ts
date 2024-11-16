import { describe, it, expect, beforeEach } from "vitest";
import app from "../src";
import { RedPillAI } from "../src/services/redpill";

describe("Chatbot Functionality", () => {
  beforeEach(() => {
    // Reset environment for each test
  });

  it("should handle successful chat requests", async () => {
    const res = await app.request("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "What is the current market sentiment?",
        model: "anthropic/claude-3.5-sonnet:beta",
      }),
    });

    expect(res.status).toBe(200);
  });

  // it("should handle invalid request body", async () => {
  //   const res = await app.request("/chat", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: "{}",
  //   });

  //   expect(res.status).toBe(500);
  // });
});
