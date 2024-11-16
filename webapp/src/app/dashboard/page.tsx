"use client";

import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { use, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Wallet2,
  Plus,
  ArrowUpRight,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Clock,
  TrendingUp,
  Bot,
  Shield,
  ArrowLeftRight,
  BracketsIcon as Bridge,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useDelegatedActions,
  usePrivy,
  useWallets,
  WalletWithMetadata,
} from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import { Notification, UserChannel } from "@/types";
import SparklesText from "@/components/ui/sparkles-text";
import Link from "next/link";
import { ChatDialog } from "@/components/ui/chat-dialog";

interface PortfolioData {
  result: {
    chain_id: number;
    contract_address: string;
    amount: number;
    price_to_usd: number;
    value_usd: number;
    abs_profit_usd: number;
    roi: number;
    status: number;
    tokenDetails: {
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      logoURI: string;
    };
  }[];
  total_balance: number;
}

const generateTimeFrameData = (
  timeFrame: "1H" | "1D" | "1W" | "1M" | "1Y" | "Max"
) => {
  const now = Date.now();
  const data = [];
  const intervals: {
    [key in "1H" | "1D" | "1W" | "1M" | "1Y" | "Max"]: number;
  } = {
    "1H": (60 * 60 * 1000) / 12,
    "1D": (24 * 60 * 60 * 1000) / 12,
    "1W": (7 * 24 * 60 * 60 * 1000) / 12,
    "1M": (30 * 24 * 60 * 60 * 1000) / 12,
    "1Y": (365 * 24 * 60 * 60 * 1000) / 12,
    Max: (5 * 365 * 24 * 60 * 60 * 1000) / 12,
  };

  let baseValue = 4000;
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now - i * intervals[timeFrame]);
    baseValue += Math.random() * 100 + 50; // Ensure consistent growth

    data.push({
      time: time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        month: "short",
        day: "numeric",
        year: timeFrame === "Max" ? "numeric" : undefined,
      }),
      value: parseFloat(baseValue.toFixed(2)),
    });
  }
  return data;
};

const timeFrames = {
  "1H": generateTimeFrameData("1H"),
  "1D": generateTimeFrameData("1D"),
  "1W": generateTimeFrameData("1W"),
  "1M": generateTimeFrameData("1M"),
  "1Y": generateTimeFrameData("1Y"),
  Max: generateTimeFrameData("Max"),
};

const assets = [
  {
    name: "1INCH",
    icon: "🦄",
    percentage: "42.23%",
    price: "$0.3092",
    priceChange: "+0.33%",
    balance: "$645,508.49",
  },
  {
    name: "DAI",
    icon: "💰",
    percentage: "36.23%",
    price: "$1.00",
    priceChange: "-0.03%",
    balance: "$555,508.49",
  },
  {
    name: "KNCL",
    icon: "🔷",
    percentage: "27.95%",
    price: "$0.63",
    priceChange: "+2.33%",
    balance: "$440,703.90",
  },
  {
    name: "ETH",
    icon: "⚡",
    percentage: "24.69%",
    price: "$1,216.65",
    priceChange: "+3.49%",
    balance: "$389,330.07",
  },
  {
    name: "OMG",
    icon: "🔵",
    percentage: "9.33%",
    price: "$1.19",
    priceChange: "+4.25%",
    balance: "$147,139.04",
  },
];

export default function Component() {
  const [selectedTab, setSelectedTab] = useState("portfolio");
  const [hasUnread, setHasUnread] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<PushAPI | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<
    "1H" | "1D" | "1W" | "1M" | "1Y" | "Max"
  >("1D");
  const [autoDCA, setAutoDCA] = useState(false);
  const totalValue = 5277.26;
  const changePercentage = 12.7;
  const changeValue = 595.74;
  const { logout, user: privyUser, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const { delegateWallet } = useDelegatedActions();

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('/api/folio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const onDelegate = async () => {
    const walletToDelegate = wallets.find(
      (wallet) => wallet.walletClientType === "privy"
    );

    // Check if the wallet to delegate by inspecting the user's linked accounts
    const isAlreadyDelegated = !!(privyUser?.linkedAccounts as WalletWithMetadata[]).find(
      (account) =>
        account.type === "wallet" &&
        account.address &&
        account.delegated === true
    );

    console.log("isAlreadyDelegated", isAlreadyDelegated);
    console.log("walletToDelegate", walletToDelegate);
    if (!walletToDelegate || isAlreadyDelegated) return;
    await delegateWallet({
      address: walletToDelegate.address,
      chainType: "solana",
    });
  };

  const handleMarkAllRead = () => {
    setHasUnread(false);
    toast.success("Marked all notifications as read");
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: { value: number }[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-green-500">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-green-500">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const NotificationsView = () => {
    const { ready, wallets } = useWallets();
    useEffect(() => {
      if (wallets.length <= 0) return;
      if (user) return;

      const loginAndWin = async () => {
        const provider = await wallets[0].getEthersProvider();

        const signer = provider.getSigner();

        const user = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
        });

        setUser(user);
      };

      loginAndWin();
    }, [wallets]);

    useEffect(() => {
      if (!user) return;

      const fetchNotifications = () => {
        user.channel
          .notifications("0xBD0B45C907069Bb51cafd960d5c1608583c71D6e")
          .then((channelResult: UserChannel) => {
            setNotifications(channelResult.notifications);
          });
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);

      return () => clearInterval(interval);
    }, []);

    return (
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
                key={notification.notifID}
                className="flex gap-4 p-4 rounded-lg bg-card border transition-colors hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                {/* <div
                  className={`${notification.iconBg} p-2 rounded-full text-foreground flex items-center justify-center h-10 w-10 flex-shrink-0`}
                >
                  {notification.channel.icon}
                </div> */}
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">
                    {notification.message.payload.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message.payload.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
    redirect("/");
  };

  useEffect(() => {
    if (!authenticated || !ready || wallets.length == 0) {
      return;
    }

    console.log("User is authenticated and ready to go!");
    onDelegate();
  }, [authenticated, ready, wallets.length]);

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
                  <p className="text-xs leading-none text-muted-foreground">
                    john@example.com
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john@example.com
                  </p>
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
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h1 className="font-semibold">Portfolio</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>${portfolioData ? portfolioData.total_balance.toLocaleString():0}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedTab === "portfolio" ? (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label htmlFor="auto-dca">Auto-DCA</Label>
                  <Switch
                    id="auto-dca"
                    checked={autoDCA}
                    onCheckedChange={setAutoDCA}
                  />
                </div>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">
                        {" "}
                        <SparklesText
                          text={`$${portfolioData ? portfolioData.total_balance.toLocaleString():0}`}
                        />
                      </div>
                      <div className="flex items-center text-sm font-normal text-blue-500">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        {changePercentage.toFixed(2)}% ($
                        {changeValue.toFixed(2)})
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
                            <linearGradient
                              id="colorValue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                          />
                          <YAxis
                            hide={true}
                            domain={["dataMin - 100", "dataMax + 100"]}
                          />
                          <Tooltip
                            content={
                              <CustomTooltip
                                active={false}
                                payload={[]}
                                label={""}
                              />
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
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
                        variant={
                          selectedTimeFrame === timeFrame
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedTimeFrame(
                            timeFrame as
                              | "1H"
                              | "1D"
                              | "1W"
                              | "1M"
                              | "1Y"
                              | "Max"
                          )
                        }
                        className={`px-3 py-1 text-xs ${
                          selectedTimeFrame === timeFrame
                            ? "bg-blue-600 text-white"
                            : "bg-background text-foreground"
                        }`}
                      >
                        {timeFrame}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  variant="default"
                  className="w-full py-6 text-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => toast.success("Swap initiated!")}
                >
                  <ArrowLeftRight className="mr-2 h-5 w-5" />
                  Swap Assets
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 text-lg border-blue-200 dark:border-blue-800"
                  onClick={() => toast.success("Transfer initiated!")}
                >
                  <Bridge className="mr-2 h-5 w-5" />
                  Transfer Assets
                </Button>
              </div>

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
                                <p className="text-sm text-muted-foreground">
                                  {asset.percentage}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{asset.price}</p>
                              <p
                                className={`text-sm ${
                                  asset.priceChange.startsWith("+")
                                    ? "text-blue-500"
                                    : "text-red-500"
                                }`}
                              >
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
                  <div className="text-center text-muted-foreground py-8">
                    No recent transactions
                  </div>
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
        <div className="max-w-md mx-auto px-8 py-6 flex justify-between items-center">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-2 ${
              selectedTab === "portfolio"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setSelectedTab("portfolio")}
          >
            <Wallet2 className="w-7 h-7" />
            <span className="text-sm">Portfolio</span>
          </Button>

          <Link href={"/deposit"}>
            <Button
              className="bg-blue-600 text-white rounded-full px-6 py-3 flex items-center gap-2 hover:bg-blue-700"
              onClick={() => toast.success("New investment initiated!")}
            >
              <Plus className="w-5 h-5" />
              <span className="text-base">New investment</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-2 relative ${
              selectedTab === "notifications"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setSelectedTab("notifications")}
          >
            <div className="relative">
              <Bell className="w-7 h-7" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </span>
              )}
            </div>
            <span className="text-sm">Alerts</span>
          </Button>
        </div>
      </footer>
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
