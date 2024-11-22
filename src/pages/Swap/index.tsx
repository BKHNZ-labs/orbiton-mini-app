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
  Box,
  ChevronDown,
  Circle,
  RefreshCcw,
  Settings,
  Triangle,
} from "lucide-react";
import { useState } from "react";
import TokenSelector from "../TokenSelector";
import { Token } from "@/interfaces";
import useTokenStore from "@/store/tokenStore";

export default function Swap() {
  const tokens = useTokenStore((state) => state.tokenList);

  const [token0, setToken0] = useState<Token>(tokens[0]);
  const [token1, setToken1] = useState<Token>(tokens[1]);

  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");

  return (
    <div className="min-h-fit bg-gray-100 p-4 flex justify-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Swap
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <TokenSelector
                children={
                  <div className="flex justify-between mb-2">
                    <Input
                      type="number"
                      value={amount1}
                      onChange={(e) => setAmount1(e.target.value)}
                      className="border-0 bg-transparent text-2xl text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 p-0 h-auto"
                      placeholder="0"
                    />
                    <Button
                      variant="outline"
                      className="text-gray-800 hover:bg-gray-100 gap-2"
                    >
                      <img
                        src={token0.image}
                        alt={token0.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      {token0.symbol}
                      <ChevronDown />
                    </Button>
                  </div>
                }
                onSetToken={setToken0}
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">${amount1 ? "0" : "0"}</span>
                <span className="text-gray-500">
                  <Circle className="h-3 w-3 inline mr-1 fill-gray-500" />0 DUST
                </span>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white border-gray-200 hover:bg-gray-50"
              >
                <ArrowDownUp className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <TokenSelector
                children={
                  <div className="flex justify-between mb-2">
                    <Input
                      type="number"
                      value={amount2}
                      onChange={(e) => setAmount2(e.target.value)}
                      className="border-0 bg-transparent text-2xl text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 p-0 h-auto"
                      placeholder="0"
                    />
                    <Button
                      variant="outline"
                      className="text-gray-800 hover:bg-gray-100 gap-2"
                    >
                      <img
                        src={token1.image}
                        alt={token1.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      {token1.symbol}
                      <ChevronDown />
                    </Button>
                  </div>
                }
                onSetToken={setToken1}
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">${amount2 ? "0" : "0"}</span>
                <span className="text-gray-500">
                  <Circle className="h-3 w-3 inline mr-1 fill-gray-500" />0 TON
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
            size="lg"
          >
            Swap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
