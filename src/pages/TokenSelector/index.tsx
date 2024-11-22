import React, { useState, ReactNode } from "react";
import { Search, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Token } from "@/interfaces";
import useTokenStore from "@/store/tokenStore";

interface TokenSelectorProps {
  children: ReactNode;
  onSetToken: (token: Token) => void,
}

export default function TokenSelector({ children, onSetToken }: TokenSelectorProps) {
  const tokens = useTokenStore((state) => state.tokenList) as Token[];

  const [selectedTokens, setSelectedTokens] = useState<Token[]>([
    tokens[0],
    tokens[1],
  ]);
  
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleToken = (token: Token) => {
    setSelectedTokens((prev) =>
      prev.find((t) => t.id === token.id)
        ? prev.filter((t) => t.id !== token.id)
        : [...prev, token]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {React.cloneElement(children as React.ReactElement, {
        onClick: () => setIsOpen(true),
      })}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal">
            Choose a coin
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by the coin's name or address"
            className="pl-9 pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        {selectedTokens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm"
              >
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-4 h-4 rounded-full"
                />
                <span>{token.symbol}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => {
                    toggleToken(token)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="max-h-[400px] space-y-1 overflow-y-auto pr-2">
          {filteredTokens.map((token) => (
            <button
              key={token.id}
              className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-muted"
              onClick={() => {
                onSetToken(token)
                setIsOpen(false)
                toggleToken(token)
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {token.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div>{token.balance ? (Number(token.balance) / 10 ** token.decimals) : 0}</div>
                <div className="text-sm text-muted-foreground">
                  ${token.value}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
