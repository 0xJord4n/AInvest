import { PrivyService } from './privyService'
import { type Address } from 'viem'
import { Context } from 'hono'

export class TransactionHandler {
  private privyService: PrivyService

  constructor() {
    let vault: Record<string, string> = {}
    try {
      vault = JSON.parse(process.env.secret || '{}')
    } catch (e) {
      console.error('Failed to parse secrets:', e)
    }

    this.privyService = new PrivyService({
      appId: vault.PRIVY_APP_ID || '',
      appSecret: vault.PRIVY_APP_SECRET || ''
    })
  }

  async handleTransaction(c: Context) {
    try {
      const body = await c.req.json()
      const { 
        walletAddress,
        to,
        value,
        data,
        type = 'transaction'
      } = body

      if (!walletAddress || !to) {
        return c.json({ error: 'Missing required parameters' }, 400)
      }

      if (type === 'sign') {
        const signature = await this.privyService.signMessage(
          walletAddress as Address,
          data
        )
        return c.json({ signature })
      }

      const transaction = {
        to: to as Address,
        value: value || '0',
        data: data || '0x'
      }

      const signedTx = await this.privyService.executeTransaction(
        walletAddress as Address,
        transaction
      )

      return c.json({
        signedTransaction: signedTx,
        from: walletAddress,
        to,
        value
      })

    } catch (error) {
      console.error('Transaction error:', error)
      return c.json({ error: 'Failed to process transaction' }, 500)
    }
  }
} 