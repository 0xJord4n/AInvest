import { describe, it, expect } from 'vitest'
import { PrivyService } from '../src/services/privyService'
import { createTestClient, http, publicActions } from 'viem'
import { baseSepolia } from 'viem/chains'

describe('PrivyService', () => {
  const testClient = createTestClient({
    chain: baseSepolia,
    transport: http(),
    mode: 'anvil',
  }).extend(publicActions)

  it('should execute delegated transaction', async () => {
    const privyService = new PrivyService({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      authSignature: 'test-auth-signature'
    })
    
    // Mock delegation
    const mockDelegation = {
      delegatorAddress: '0x...',
      delegationAuthToken: 'mock-token',
      permissions: {
        allowedCalls: [{
          target: '0x...',
          functionName: 'transfer',
          valueLimit: 1000000000000000000n
        }],
        expiresAt: Date.now() + 3600000
      }
    }

    await privyService.storeDelegation('test-user', mockDelegation)

    // Test transaction execution
    const hash = await privyService.executeTransaction(
      'test-user',
      mockDelegation.permissions.allowedCalls[0].target,
      'transfer',
      ['0x...', 1000000000000000000n]
    )

    const receipt = await testClient.getTransactionReceipt({ hash })
    expect(receipt.status).toBe('success')
  })
}) 