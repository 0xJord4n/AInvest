'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageSquare, Settings, Bell, User, LogOut, Moon, Sun, Zap, ArrowUpRight, ArrowDownRight, Wallet, RefreshCw, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast, Toaster } from 'react-hot-toast'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useSpring, animated } from 'react-spring'
import { useTheme } from 'next-themes'

// Simulated data for the charts
const profitData = [
  { name: 'Mon', profit: 5000 },
  { name: 'Tue', profit: 8000 },
  { name: 'Wed', profit: 3000 },
  { name: 'Thu', profit: 12000 },
  { name: 'Fri', profit: 15000 },
  { name: 'Sat', profit: 18000 },
  { name: 'Sun', profit: 21000 },
]

const portfolioData = [
  { name: 'ETH', value: 45 },
  { name: 'BTC', value: 30 },
  { name: 'DOT', value: 15 },
  { name: 'ADA', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const AnimatedNumber = ({ n }: { n: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  })
  return <animated.span>{number.to((n) => `$${n.toFixed(2)}`)}</animated.span>
}

export default function EnhancedMobileCryptoDashboard() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentProfit, setCurrentProfit] = useState(21000)
  const [autoDCA, setAutoDCA] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: inputMessage }])
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', content: 'Based on current market trends, I recommend increasing your allocation to ETH by 5%. The upcoming network upgrade could potentially boost its value. Would you like me to make this adjustment for you?' }])
      }, 1000)
      setInputMessage('')
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleAutoDCAToggle = () => {
    setAutoDCA(!autoDCA)
    toast.success(`Auto-DCA ${!autoDCA ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-4 pb-16`}>
      <Toaster />
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="@johndoe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Portfolio Value</span>
            <motion.div
              animate={{ rotate: currentProfit > 20000 ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {currentProfit > 20000 ? <ArrowUpRight className="text-green-500" /> : <ArrowDownRight className="text-red-500" />}
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600 mb-4">
            <AnimatedNumber n={currentProfit} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={profitData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Auto-DCA
              </span>
              <Switch checked={autoDCA} onCheckedChange={handleAutoDCAToggle} />
            </div>
            <Button className="w-full" onClick={() => toast.success('Swapped assets successfully!')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Swap Assets
            </Button>
            <Button className="w-full" variant="outline" onClick={() => toast.success('Bridged assets to Ethereum mainnet!')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Bridge Assets
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <motion.div
        animate={{ height: isExpanded ? 'auto' : '60px' }}
        className="bg-card rounded-lg shadow-lg overflow-hidden mb-6"
      >
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <h2 className="text-xl font-semibold">Market Insights</h2>
          <ChevronDown className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 border-t"
            >
              <Tabs defaultValue="trends" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                </TabsList>
                <TabsContent value="trends">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>ETH showing bullish momentum due to upcoming network upgrade</li>
                    <li>BTC dominance decreasing, altcoins gaining market share</li>
                    <li>DeFi tokens experiencing increased volatility</li>
                  </ul>
                </TabsContent>
                <TabsContent value="news">
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Major Exchange Launches New Cross-Chain Bridge</a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Regulatory Clarity Boosts Institutional Crypto Adoption</a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">New Layer 2 Solution Promises 100x Throughput</a>
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              <MessageSquare size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90%] h-[80vh]">
            <DialogHeader>
              <DialogTitle>AI Crypto Assistant</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto mb-4 p-4 bg-muted rounded-lg">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {message.content}
                  </span>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about crypto trends..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}