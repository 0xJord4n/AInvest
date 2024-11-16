import { Hono } from 'hono'
import { TappdClient } from '@phala/dstack-sdk'
import { RedPillAI } from './services/redpill'
import { privateKeyToAccount } from 'viem/accounts'
import { 
  keccak256,
  http,
  createPublicClient,
  createWalletClient,
  parseGwei
} from 'viem'
import { baseSepolia } from 'viem/chains'
import superjson from 'superjson'

const app = new Hono()

// Initialize clients
const teeEndpoint = process.env.DSTACK_SIMULATOR_ENDPOINT || 'http://localhost:8090'
const teeClient = new TappdClient(teeEndpoint)
const redPillService = new RedPillAI()

// Initialize blockchain clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
})

// Helper function to get TEE-derived account
async function getTeeAccount(purpose = "test") {
  const derivedKey = await teeClient.deriveKey("/", purpose)
  const privateKey = keccak256(derivedKey.asUint8Array())
  return privateKeyToAccount(privateKey)
}

app.get('/', async (c) => {
  const account = await getTeeAccount("health-check")
  return c.json({ 
    status: 'ok',
    teeAccount: account.address
  })
})

// AI Chat endpoint
app.post('/chat', async (c) => {
  let vault: Record<string, string> = {}
  try {
    vault = JSON.parse(process.env.secret || '{}')
  } catch (e) {
    console.error('Failed to parse secrets:', e)
    return c.json({ error: 'Failed to parse secrets' }, 500)
  }

  const apiKey = vault.REDPILL_API_KEY || ''
  if (!apiKey) {
    return c.json({ error: 'API key not configured' }, 401)
  }

  try {
    const body = await c.req.json()
    const { message, model = 'gpt-4o' } = body

    const response = await redPillService.chat({
      message,
      model,
      apiKey
    })

    return c.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return c.json({ error: 'Failed to process chat request' }, 500)
  }
})

// Sign message endpoint
app.post('/sign', async (c) => {
  try {
    const { message } = await c.req.json()
    const account = await getTeeAccount()
    
    console.log(`Account [${account.address}] Signing Message [${message}]`)
    const signature = await account.signMessage({ message })
    console.log(`Message Signed [${signature}]`)

    return c.json({ 
      account: account.address, 
      message, 
      signature 
    })
  } catch (error) {
    console.error('Signing error:', error)
    return c.json({ error: 'Failed to sign message' }, 500)
  }
})

// Transaction endpoint
app.post('/transaction', async (c) => {
  try {
    const { to, gweiAmount } = await c.req.json()
    const account = await getTeeAccount()
    
    let result = {
      derivedPublicKey: account.address,
      to,
      gweiAmount,
      hash: '',
      receipt: {}
    }

    console.log(`Sending Transaction with Account ${account.address} to ${to} for ${gweiAmount} gwei`)
    
    const hash = await walletClient.sendTransaction({
      account,
      to,
      value: parseGwei(`${gweiAmount}`),
    })
    
    console.log(`Transaction Hash: ${hash}`)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log(`Transaction Status: ${receipt.status}`)
    
    result.hash = hash
    result.receipt = receipt

    const { json: jsonResult } = superjson.serialize(result)
    return c.json({ jsonResult })

  } catch (error) {
    console.error('Transaction error:', error)
    return c.json({ error })
  }
})

export default app