import { describe, it, expect, beforeEach } from "vitest";
import app from "../src";
import { type Address } from "viem";
import { PrivyService } from "../src/services/privyService";
import { PrivyAuthHelper } from "../src/utils/privyAuth";

describe("Privy Transaction Functionality", () => {
  let privyService: PrivyService;
  const mockWallet: Address = "0x01463A2B08A35Dc7908CCD9625E0305Dc26Db275";

  beforeEach(() => {
    const secrets = require("../secrets/default.json");
    process.env.secret = JSON.stringify(secrets);

    privyService = new PrivyService({
      appId: secrets.PRIVY_APP_ID,
      appSecret: secrets.PRIVY_APP_SECRET,
    });
  });

  describe("Authorization", () => {
    it("should generate valid authorization signatures", async () => {
      const testRequest = {
        address: mockWallet,
        chain_type: "ethereum",
        method: "eth_signTransaction",
        params: {
          transaction: {
            to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            value: "0.1",
          },
        },
      };

      const authHelper = PrivyAuthHelper.fromSecrets();
      const signature = authHelper.generateAuthSignature(testRequest);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe("string");
      expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 validation
    });
  });

  it("should handle transaction signing requests", async () => {
    const result = await privyService.executeTransaction(mockWallet, {
      to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      value: 10000,
    });

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should handle message signing requests", async () => {
    const result = await privyService.signMessage(
      mockWallet,
      "Test message to sign"
    );

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should handle missing parameters", async () => {
    await expect(
      privyService.executeTransaction(mockWallet, {
        to: undefined as any, // Testing missing parameters
        value: undefined as any,
        data: "0x",
      })
    ).rejects.toThrow();
  });
});
