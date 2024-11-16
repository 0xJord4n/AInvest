'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Wallet2, Plus, ArrowUpRight, MessageSquare, Settings, User, LogOut, Clock, TrendingUp, Bot, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const generateTimeFrameData = (timeFrame: '1H' | '1D' | '1W' | '1M' | '1Y' | 'Max') => {
  const now = Date.now()
  const data = []
  const intervals: { [key in '1H' | '1D' | '1W' | '1M' | '1Y' | 'Max']: number } = {
    '1H': 60 * 60 * 1000 / 12,
    '1D': 24 * 60 * 60 * 1000 / 12,
    '1W': 7 * 24 * 60 * 60 * 1000 / 12,
    '1M': 30 * 24 * 60 * 60 * 1000 / 12,
    '1Y': 365 * 24 * 60 * 60 * 1000 / 12,
    'Max': 5 * 365 * 24 * 60 * 60 * 1000 / 12
  }

  let baseValue = 4000
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now - i * intervals[timeFrame])
    baseValue += Math.random() * 100 + 50 // Ensure consistent growth
    data.push({
      time: time.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: 'short',
        day: 'numeric',
        year: timeFrame === 'Max' ? 'numeric' : undefined
      }),
      value: parseFloat(baseValue.toFixed(2))
    })
  }
  return data
}

const timeFrames = {
  '1H': generateTimeFrameData('1H'),
  '1D': generateTimeFrameData('1D'),
  '1W': generateTimeFrameData('1W'),
  '1M': generateTimeFrameData('1M'),
  '1Y': generateTimeFrameData('1Y'),
  'Max': generateTimeFrameData('Max')
}

const assets = [
  { name: '1INCH', icon: '🦄', percentage: '42.23%', price: '$0.3092', priceChange: '+0.33%', balance: '$645,508.49' },
  { name: 'DAI', icon: '💰', percentage: '36.23%', price: '$1.00', priceChange: '-0.03%', balance: '$555,508.49' },
  { name: 'KNCL', icon: '🔷', percentage: '27.95%', price: '$0.63', priceChange: '+2.33%', balance: '$440,703.90' },
  { name: 'ETH', icon: '⚡', percentage: '24.69%', price: '$1,216.65', priceChange: '+3.49%', balance: '$389,330.07' },
  { name: 'OMG', icon: '🔵', percentage: '9.33%', price: '$1.19', priceChange: '+4.25%', balance: '$147,139.04' },
]

const notifications = [
  {
    id: 1,
    icon: <Clock className="w-6 h-6" />,
    title: "New Investment Opportunity",
    description: "A new DCA strategy is available for Bitcoin.",
    timeAgo: "5 min ago",
    iconBg: "bg-blue-500/10",
  },
  {
    id: 2,
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Portfolio Update",
    description: "Your Ethereum holdings have increased by 5%.",
    timeAgo: "1 hour ago",
    iconBg: "bg-green-500/10",
  },
  {
    id: 3,
    icon: <Bot className="w-6 h-6" />,
    title: "AI Agent Alert",
    description: "Your AI agent has made a new recommendation.",
    timeAgo: "2 hours ago",
    iconBg: "bg-purple-500/10",
  },
  {
    id: 4,
    icon: <Shield className="w-6 h-6" />,
    title: "Security Update",
    description: "New TEE protocols have been implemented.",
    timeAgo: "1 day ago",
    iconBg: "bg-gray-500/10",
  },
]

export default function Component() {
  const [selectedNetwork, setSelectedNetwork] = useState('All networks')
  const [selectedTab, setSelectedTab] = useState('portfolio')
  const [hasUnread, setHasUnread] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'1H' | '1D' | '1W' | '1M' | '1Y' | 'Max'>('1D')
  const totalValue = 5277.26
  const changePercentage = 12.70
  const changeValue = 595.74

  const handleMarkAllRead = () => {
    setHasUnread(false)
    toast.success('Marked all notifications as read')
  }

  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: { value: number }[], label: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-green-500">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  const NotificationsView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
          Mark All as Read
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex gap-4 p-4 rounded-lg bg-card border transition-colors hover:bg-accent"
            >
              <div className={`${notification.iconBg} p-2 rounded-full text-foreground flex items-center justify-center h-10 w-10 flex-shrink-0`}>
                {notification.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground">{notification.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toaster />
      <header className="border-b p-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage src="/placeholder.svg" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
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
          <div>
            <h1 className="font-semibold">Portfolio</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedTab === 'portfolio' ? (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <div className="flex items-center gap-2 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedNetwork}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={() => setSelectedNetwork('All networks')}>
                      All networks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedNetwork('Ethereum')}>
                      Ethereum
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedNetwork('Polygon')}>
                      Polygon
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
                      <div className="flex items-center text-sm font-normal text-green-500">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        {changePercentage.toFixed(2)}% (${changeValue.toFixed(2)})
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTimeFrame}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={timeFrames[selectedTimeFrame]}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis 
                            hide={true}
                            domain={['dataMin - 100', 'dataMax + 100']}
                          />
                          <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22c55e" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex justify-between mt-4">
                    {Object.keys(timeFrames).map((timeFrame) => (
                      <Button
                        key={timeFrame}
                        variant={selectedTimeFrame === timeFrame ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeFrame(timeFrame)}
                        className={`px-3 py-1 text-xs ${selectedTimeFrame === timeFrame ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
                      >
                        {timeFrame}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="tokens" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="tokens" className="space-y-4">
                  <ScrollArea className="h-[calc(100vh-460px)]">
                    {assets.map((asset, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{asset.icon}</span>
                              <div>
                                <h3 className="font-semibold">{asset.name}</h3>
                                <p className="text-sm text-muted-foreground">{asset.percentage}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{asset.price}</p>
                              <p className={`text-sm ${asset.priceChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {asset.priceChange}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Balance: {asset.balance}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="transactions">
                  <div className="text-center text-muted-foreground py-8">No recent transactions</div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <NotificationsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="max-w-md mx-auto px-8 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${selectedTab === 'portfolio' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setSelectedTab('portfolio')}
          >
            <Wallet2 className="w-6 h-6" />
            <span className="text-xs">Portfolio</span>
          </Button>

          <Button
            className="bg-primary text-primary-foreground rounded-full px-6 py-2 flex items-center gap-2 hover:bg-primary/90"
            onClick={() => toast.success('New investment initiated!')}
          >
            <Plus className="w-4 h-4" />
            <span>New investment</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 relative ${selectedTab === 'notifications' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setSelectedTab('notifications')}
          >
            <div className="relative">
              <Bell className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </span>
              )}
            </div>
            <span className="text-xs">Alerts</span>
          </Button>
        </div>
      </footer>
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
      >
        <MessageSquare size={24} />
      </Button>
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        {/* Chatbot Dialog content here */}
      </Dialog>
    </div>
  )
}