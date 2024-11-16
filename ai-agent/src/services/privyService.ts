import { type Address } from 'viem'
import { type PrivyPersonalSignResponse, type PrivySignTransactionResponse } from '../types/transaction'
import { PrivyAuthHelper } from '../utils/privyAuth'

interface PrivyConfig {
  appId: string
  appSecret: string
}

export class PrivyService {
  private baseUrl = 'https://auth.privy.io/api/v1'
  private config: PrivyConfig
  private authHelper: PrivyAuthHelper

  constructor(config: PrivyConfig) {
    this.config = config
    this.authHelper = PrivyAuthHelper.fromSecrets()
  }

  private async makeRequest(endpoint: string, data: any) {
    const signature = this.authHelper.generateAuthSignature(data)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.config.appId}:${this.config.appSecret}`).toString('base64')}`,
        'privy-app-id': this.config.appId,
        'privy-authorization-signature': signature
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Privy API error: ${response.statusText}`)
    }

    return response.json()
  }

  
  async executeTransaction(
    walletAddress: Address,
    transaction: {
      to: Address,
      value: string,
      data: `0x${string}`
    }
  ): Promise<string> {
    const request = {
      address: walletAddress,
      chain_type: 'ethereum',
      method: 'eth_signTransaction',
      params: {
        transaction
      }
    }

    const response = await this.makeRequest('/wallets/rpc', request) as PrivySignTransactionResponse
    return response.data.signed_transaction
  }

  async signMessage(
    walletAddress: Address, 
    message: string
  ): Promise<string> {
    const request = {
      address: walletAddress,
      chain_type: 'ethereum',
      method: 'personal_sign',
      params: {
        message,
        encoding: 'utf-8'
      }
    }

    const response = await this.makeRequest('/wallets/rpc', request) as PrivyPersonalSignResponse
    return response.data.signature
  }
} 