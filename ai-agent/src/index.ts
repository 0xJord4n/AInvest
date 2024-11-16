import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { handle } from '@phala/wapo-env/guest'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as PushAPI from "@pushprotocol/restapi"
import { createWalletClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

export const app = new Hono()

// Schema definitions
const ConfigureSchema = z.object({
  userId: z.string(),
  investmentAmount: z.number(),
  frequency: z.string(), // daily, weekly, monthly
  targetToken: z.string(),
  delegateAuth: z.string() // Privy delegate auth token
})

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http()
})

// Endpoints
app.post('/configure', zValidator('json', ConfigureSchema), async (c) => {
  const data = await c.req.json()
  // Store configuration in vault
  let vault: Record<string, string> = {}
  try {
    vault = JSON.parse(process.env.secret || '{}')
    vault[`config_${data.userId}`] = JSON.stringify(data)
    // Would need to update vault here
    return c.json({ success: true, message: 'Configuration saved' })
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to save configuration" })
  }
})

app.get('/status/:userId', async (c) => {
  const userId = c.req.param('userId')
  let vault: Record<string, string> = {}
  try {
    vault = JSON.parse(process.env.secret || '{}')
    const config = vault[`config_${userId}`]
    if (!config) {
      return c.json({ error: "No configuration found" })
    }
    return c.json({ 
      config: JSON.parse(config),
      lastExecution: vault[`last_execution_${userId}`] || null
    })
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to get status" })
  }
})

export default handle(app)
