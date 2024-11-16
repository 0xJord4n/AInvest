'use client'

import { useState } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, Toaster } from "react-hot-toast"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import SparklesText from "@/components/ui/sparkles-text"
import usdcLogo from '@/../public/usd-coin-usdc-logo.png'
import visaLogo from '@/../public/visa-svgrepo-com.svg'
import mastercardLogo from '@/../public/mc_symbol.svg'
import paypalLogo from '@/../public/paypal-svgrepo-com.svg'
import applepayLogo from '@/../public/apple-pay-logo-svgrepo-com.svg'
import googlepayLogo from '@/../public/google-pay-primary-logo-logo-svgrepo-com.svg'

export default function Component() {
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const walletAddress = "0x30C50B8160cd31320faB5326e572F5d"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    toast.success('Address copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMaybeLater = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toaster />
      <header className="border-b p-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleMaybeLater}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-semibold">Deposit USDC</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-hidden">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <SparklesText text="Deposit USDC (Base)" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Image
                src={usdcLogo}
                alt="USDC Logo"
                width={64}
                height={64}
                quality={10}
                className="rounded-full"
              />
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 flex items-center justify-center rounded-full">1</span>
                <div>
                  <p className="text-muted-foreground">
                    Buy USDC on{' '}
                    <span className="text-blue-400">Coinbase</span>,{' '}
                    <span className="text-blue-400">Binance</span> or another{' '}
                    <span className="text-blue-400 hover:underline cursor-pointer">exchange</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 flex items-center justify-center rounded-full">2</span>
                <div>
                  <p className="text-muted-foreground">
                    Send/withdraw USDC to the address below and select{' '}
                    <span className="bg-blue-500/20 px-2 py-1 rounded text-sm">
                      <Image
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg"
                        height={16}
                        width={16}
                        alt="Base"
                        className="inline mr-1 rounded-full"
                      />
                      Base
                    </span>
                    {' '}as the network.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-muted">
              <CardContent className="p-3">
                <code className="text-muted-foreground text-sm break-all">{walletAddress}</code>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Address
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-lg mb-4 font-semibold">Other methods</h2>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <div key={method} className="bg-muted p-2 rounded flex items-center justify-center">
                <Image
                  src={
                    method === 'Visa' ? visaLogo :
                    method === 'Mastercard' ? mastercardLogo :
                    method === 'PayPal' ? paypalLogo :
                    method === 'Apple Pay' ? applepayLogo :
                    googlepayLogo
                  }
                  alt={method}
                  width={56}
                  height={56}
                />
              </div>
            ))}
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => toast.success('Redirecting to purchase page...')}
          >
            Buy USDC
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="max-w-md mx-auto px-8 py-6 flex justify-center">
          <Button
            variant="outline"
            className="w-full border-blue-200 dark:border-blue-800 text-black"
            onClick={handleMaybeLater}
          >
            Maybe Later
          </Button>
        </div>
      </footer>
    </div>
  )
}