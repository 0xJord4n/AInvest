import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src'
import { type Address } from 'viem'

describe('Privy Transaction Functionality', () => {
  beforeEach(() => {
    // use secrets from secrets/default.json
    const secrets = require('../secrets/default.json')
    
    process.env.secret = JSON.stringify(secrets)
    })
  })

  it('should handle transaction signing requests', async () => {
    const testWallet: Address = '0xC5227Cb20493b97bb02fADb20360fe28F52E2eff'
    
    const res = await app.request('/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: testWallet,
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
    const testWallet: Address = '0xC5227Cb20493b97bb02fADb20360fe28F52E2eff'
    
    const res = await app.request('/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: testWallet,
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
