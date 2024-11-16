// Base response interface
interface PrivyBaseResponse {
  method: string
  data: {
    encoding: string
  }
}

// Personal sign response
export interface PrivyPersonalSignResponse extends PrivyBaseResponse {
  method: 'personal_sign'
  data: {
    signature: string
    encoding: 'hex'
  }
}

// Transaction sign response
export interface PrivySignTransactionResponse extends PrivyBaseResponse {
  method: 'eth_signTransaction'
  data: {
    signed_transaction: string
    encoding: 'rlp'
  }
}

// Union type for all Privy responses
export type PrivyResponse = PrivyPersonalSignResponse | PrivySignTransactionResponse
