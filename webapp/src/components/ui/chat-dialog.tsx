'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { fetchPortfolioValue } from '@/hooks/useInchFolio';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi, I'm Alfred, how can I assist you with your portfolio today?"
};

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioContext, setPortfolioContext] = useState<any>(null);

  useEffect(() => {
    const loadPortfolioContext = async () => {
      try {
        const data = await fetchPortfolioValue();
        setPortfolioContext(data);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      }
    };

    if (open) {
      loadPortfolioContext();
    }
  }, [open]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content }]);
    
    try {
      // Construct message with portfolio context
      const contextualizedMessage = `
Portfolio Context: ${JSON.stringify(portfolioContext)}

This is now the message sent from the user:
${content}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualizedMessage,
          model: 'anthropic/claude-3.5-sonnet:beta'
        }),
      });

      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally add an error message to the chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble processing your request. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 mb-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'assistant'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] space-y-2">
                  <Skeleton className="h-4 w-[190px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
            placeholder="Ask me anything about your portfolio..."
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 