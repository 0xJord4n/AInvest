import { type Address } from 'viem'

export interface DelegationPayload {
  delegatorAddress: Address
  delegationAuthToken: string
  permissions: {
    allowedCalls: {
      target: Address
      functionName: string
      valueLimit: bigint
    }[]
    expiresAt: number
  }
}

export interface StoredDelegation extends DelegationPayload {
  userId: string
} 