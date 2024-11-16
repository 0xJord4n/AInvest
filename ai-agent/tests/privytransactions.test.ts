import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src'
import { type Address } from 'viem'
import { PrivyService } from '../src/services/privyService'
import { PrivyAuthHelper } from '../src/utils/privyAuth'

describe('Privy Transaction Functionality', () => {
  let privyService: PrivyService
  const mockWallet: Address = '0xe5634ed0149037E935F6B09bB1864865500198E5'

  beforeEach(() => {
    const secrets = require('../secrets/default.json')
    process.env.secret = JSON.stringify(secrets)

    privyService = new PrivyService({
      appId: secrets.PRIVY_APP_ID,
      appSecret: secrets.PRIVY_APP_SECRET
    })
  })

  describe('Authorization', () => {
    it('should generate valid authorization signatures', async () => {
      const testRequest = {
        address: mockWallet,
        chain_type: 'ethereum',
        method: 'eth_signTransaction',
        params: {
          transaction: {
            to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            value: '0.1',
            data: '0x'
          }
        }
      }

      const authHelper = PrivyAuthHelper.fromSecrets()
      const signature = authHelper.generateAuthSignature(testRequest)
      
      expect(signature).toBeDefined()
      expect(typeof signature).toBe('string')
      expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/) // Base64 validation
    })
  })

  it('should handle transaction signing requests', async () => {
    const res = await app.request('/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: mockWallet,
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        value: '0.1',
        data: '0x'
      })
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('signedTransaction')
    expect(data).toHaveProperty('from')
    expect(data).toHaveProperty('to')
  })

  it('should handle message signing requests', async () => {
    const res = await app.request('/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: mockWallet,
        data: 'Test message to sign'
      })
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('signature')
  })

  it('should handle missing parameters', async () => {
    const res = await app.request('/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Missing required parameters
      })
    })

    expect(res.status).toBe(400)
  })

})
