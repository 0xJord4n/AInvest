'use client'

import { usePrivy } from '@privy-io/react-auth'
import { RainbowButton } from "@/components/ui/rainbow-button"
import Providers from '@/components/providers'

function HomePage() {
  const { login } = usePrivy()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RainbowButton onClick={login} className="px-6 py-3 text-lg font-semibold">
        Sign In
      </RainbowButton>
    </div>
  )
}

export default function Home() {
  return (
    <Providers>
      <HomePage />
    </Providers>
  )
}