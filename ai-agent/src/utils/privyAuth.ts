import canonicalize from 'canonicalize'
import crypto from 'crypto'

export class PrivyAuthHelper {
  private privateKey: crypto.KeyObject

  constructor(privateKeyString: string) {
    const privateKeyAsPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyString}\n-----END PRIVATE KEY-----`
    this.privateKey = crypto.createPrivateKey({
      key: privateKeyAsPem,
      format: 'pem',
    })
  }

  generateAuthSignature(request: any): string {
    const serializedPayload = canonicalize(request) as string
    const serializedPayloadBuffer = Buffer.from(serializedPayload)

    const signatureBuffer = crypto.sign(
      'sha256',
      serializedPayloadBuffer,
      this.privateKey
    )
    
    return signatureBuffer.toString('base64')
  }

  static fromSecrets(): PrivyAuthHelper {
    try {
      const secrets = require('../../secrets/default.json')
      const privateKey = secrets.PRIVY_WALLET_API_KEY
      
      if (!privateKey) {
        throw new Error('PRIVY_WALLET_API_KEY not found in secrets')
      }

      return new PrivyAuthHelper(privateKey)
    } catch (error) {
      throw new Error(`Failed to initialize PrivyAuthHelper: ${error.message}`)
    }
  }
} 