'use client'

import { usePrivy } from '@privy-io/react-auth'
import { RainbowButton } from "@/components/ui/rainbow-button"
import Providers from '@/components/providers'
import { motion } from "framer-motion"
import { Bot, ShieldCheck, TrendingUp } from 'lucide-react'
import { Card } from "@/components/ui/card"

function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white dark:bg-gray-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80b3ff2a_1px,transparent_1px),linear-gradient(to_bottom,#80b3ff2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-blue-100 dark:border-blue-900">
      <Icon className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </Card>
  )
}

function HomePage() {
  const { login } = usePrivy()

  return (
    <div className="min-h-screen">
      <GradientBackground />
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Ainvest
          </h1>
          <RainbowButton onClick={login} className="px-4 py-2">
            Sign In
          </RainbowButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Secure Investing for the Web3 Era
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the future of investing with our advanced AI algorithms and blockchain security
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RainbowButton onClick={login} className="px-8 py-4 text-lg">
              Start Investing Securely
            </RainbowButton>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FeatureCard
            icon={Bot}
            title="AI-Driven Analysis"
            description="Advanced algorithms analyze market trends and opportunities 24/7 to optimize your investment strategy"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Bank-Grade Security"
            description="Your investments are protected by military-grade encryption and blockchain technology"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Portfolio"
            description="Automated portfolio management tailored to your risk tolerance and investment goals"
          />
        </motion.div>

        {/* Floating Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </main>
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