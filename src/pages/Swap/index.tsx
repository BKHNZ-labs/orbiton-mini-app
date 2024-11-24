"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowDownUp,
  ChevronDown,
  Circle,
  RefreshCcw,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import TokenSelector from "../TokenSelector";
import { Token } from "@/interfaces";
import useTokenStore from "@/store/tokenStore";
import { useCounterContract } from "@/hooks/useCounterContract";
import { getSimulateExactInAmountOut } from "@/apis/indexer";
import { useSwap } from "./hooks/useSwap";
import useDebounce from "@/hooks/useDebounce";

export default function Swap() {
  const tokens = useTokenStore((state) => state.tokenList);

  const { sendIncrement } = useCounterContract();
  const [token0, setToken0] = useState<Token>(tokens[1]);
  const [token1, setToken1] = useState<Token>(tokens[0]);
  const [amountIn, setAmountIn] = useState<string>("");
  const amountDebounce = useDebounce(amountIn, 500);
  const { simulateResponse, setSimulateParams, simulateParams, swap } =
    useSwap();

  useEffect(() => {
    if (!token0.address || !token1.address) return;
    setSimulateParams({
      ...simulateParams,
      tokenIn: token0.address,
      tokenOut: token1.address,
      amountIn: amountDebounce,
    });
  }, [amountDebounce, token0, token1]);

  return (
    <div className="min-h-fit bg-background p-4 flex justify-center">
      <Card className="w-full max-w-md bg-card shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-semibold text-primary">
            Swap
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary-foreground hover:bg-primary/90"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 border border-border">
              <div className="flex justify-between mb-2">
                <Input
                  type="number"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className="border-0 bg-transparent text-2xl text-primary placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto"
                  placeholder="0"
                />
                <TokenSelector
                  children={
                    <Button
                      variant="outline"
                      className="text-primary hover:bg-accent gap-2"
                    >
                      <img
                        src={token0.image}
                        alt={token0.name}
                        className="w-12 h-12 rounded-full border-2 border-white -translate-x-2"
                      />
                      {token0.symbol}
                      <ChevronDown />
                    </Button>
                  }
                  onSetToken={setToken0}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">${amountIn ? "0" : "0"}</span>
                <span className="text-gray-500">
                  <Circle className="h-3 w-3 inline mr-1 fill-gray-500" />0 DUST
                </span>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-background border-border hover:bg-accent"
              >
                <ArrowDownUp className="h-4 w-4 text-primary" />
              </Button>
            </div>

            <div className="rounded-lg bg-muted p-4 border border-border">
              <div className="flex justify-between mb-2">
                <Input
                  type="number"
                  value={simulateResponse.simulateAmountOut}
                  // onChange={(e) => setAmount1(e.target.value)}
                  disabled={true}
                  className="border-0 bg-transparent text-2xl text-primary placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto"
                  placeholder="0"
                />
                <TokenSelector
                  children={
                    <Button
                      variant="outline"
                      className="text-primary hover:bg-accent gap-2"
                    >
                      <img
                        src={token1.image}
                        alt={token1.name}
                        className="w-12 h-12 rounded-full border-2 border-white -translate-x-2"
                      />
                      {token1.symbol}
                      <ChevronDown />
                    </Button>
                  }
                  onSetToken={setToken1}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  ${simulateResponse.simulateAmountOut}
                </span>
                <span className="text-gray-500">
                  <Circle className="h-3 w-3 inline mr-1 fill-gray-500" />0 TON
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
            size="lg"
            onClick={() => swap()}
          >
            Swap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
