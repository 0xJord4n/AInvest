'use client';

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { formatUnits } from "viem";

type Transaction = {
    details: {
        txHash: string;
        type: string;
        blockNumber: number;
    };
    timeMs: number;
    tokenActions: TokenAction[];
}

type TokenAction = {
    chainId: string;
    address: string;
    standard: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    direction: string;
}
     
interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-460px)]">
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <Card key={tx.details.txHash} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {tx.details.txHash.slice(0, 6)}...{tx.details.txHash.slice(-4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tx.timeMs).toLocaleString()}
                  </div>
                  <Link 
                    href={`https://base.blockscout.com/tx/${tx.details.txHash}`}
                    target="_blank"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View on <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">Blockscout</span> ✨
                  </Link>
                </div>
                <div className="text-right">
                  {tx.tokenActions?.map((action, i) => (
                    <div key={i} className="text-sm font-medium">
                      {action.direction === "Out" ? (
                        <span className="text-red-500">
                          -{formatUnits(BigInt(action.amount), 18)}
                        </span>
                      ) : (
                        <span className="text-green-500">
                          +{formatUnits(BigInt(action.amount), 18)}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground">
                    Type: {tx.details.type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Block: {tx.details.blockNumber}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No recent transactions
        </div>
      )}
    </ScrollArea>
  );
}