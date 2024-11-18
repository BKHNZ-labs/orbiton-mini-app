import { Minus, Plus, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function AddPosition() {
  const [feeTier, setFeeTier] = useState("0.30");
  const [isPoolCreated, setIsPoolCreated] = useState(true);
  const [token1, setToken1] = useState({ symbol: "ETH", balance: "0.014" });
  const [token2, setToken2] = useState({ symbol: "USDT", balance: "0" });

  const feeTiers = [
    { value: "0.01", percentage: "3% select" },
    { value: "0.05", percentage: "18% select" },
    { value: "0.30", percentage: "78% select" },
    { value: "1.00", percentage: "0% select" },
  ];

  // for testing
  useEffect(() => {
    if (feeTier === feeTiers[0].value) {
      setIsPoolCreated(false);
    } else {
      setIsPoolCreated(true);
    }
  }, [feeTier]);

  return (
    <Dialog>
      <DialogTrigger className="w-full py-2 md:px-4 bg-[#1a1a1a] text-white rounded-2xl">
        + New Position
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-screen overflow-y-auto sm:max-h-[90vh] [&>button]:hidden">
        <DialogHeader className="flex-row justify-center items-center space-x-0 space-y-0">
          <DialogTitle>Add liquidity</DialogTitle>
          {/* <div className="flex gap-2"> */}
          {/* <Button variant="ghost" size="sm" className="text-purple-600">
              Clear all
            </Button> */}
          {/* <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button> */}
          {/* </div> */}
          <DialogClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-sm font-medium">Select pair</div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={token1.symbol}
                onValueChange={(value) =>
                  setToken1({ ...token1, symbol: value })
                }
              >
                <SelectTrigger className="bg-gray-50">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-500 w-5 h-5" />
                      {token1.symbol}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={token2.symbol}
                onValueChange={(value) =>
                  setToken2({ ...token2, symbol: value })
                }
              >
                <SelectTrigger className="bg-gray-50">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-500 w-5 h-5" />
                      {token2.symbol}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">0.30% fee tier</div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                Hide
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {feeTiers.map((tier) => (
                <div
                  key={tier.value}
                  className={`relative rounded-lg border ${
                    feeTier === tier.value
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 bg-gray-50"
                  } p-3 cursor-pointer`}
                  onClick={() => setFeeTier(tier.value)}
                >
                  <div className="text-sm font-medium">{tier.value}%</div>
                  <div className="text-xs text-gray-500">{tier.percentage}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Set price range</div>
              <div className="flex gap-2">
                <Badge variant="secondary">Full range</Badge>
                <Badge variant="secondary">ETH</Badge>
                <Badge variant="secondary">USDT</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm ">Low price</label>
                <div className="relative">
                  <Input className="bg-gray-50" defaultValue="2092.3024" />
                  <div className="absolute right-0 top-0 h-full flex gap-1 pr-2">
                    <Button variant="ghost" size="icon" className="h-full">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">USDT per ETH</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm ">High price</label>
                <div className="relative">
                  <Input className="bg-gray-50" defaultValue="5563.4375" />
                  <div className="absolute right-0 top-0 h-full flex gap-1 pr-2">
                    <Button variant="ghost" size="icon" className="h-full">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">USDT per ETH</div>
              </div>
            </div>
          </div>

          {isPoolCreated ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div>Current price:</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative h-48 bg-gray-50 rounded-lg border border-gray-200">
                {/* Price range visualization */}
                <div className="absolute left-[25%] top-0 bottom-0 w-0.5 bg-blue-500" />
                <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-green-500" />
                <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-gray-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>2,000</span>
                <span>4,000</span>
                <span>6,000</span>
                <span>8,000</span>
              </div>
            </div>
          ) : (
            <div>
              <Alert className="bg-purple-50 border-purple-200">
                <AlertDescription className="text-purple-700">
                  This pool must be initialized before you can add liquidity. To
                  initialize, select a starting price for the pool. Then, enter
                  your liquidity price range and deposit amount. Gas fees will
                  be higher than usual due to the initialization transaction.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Input className="bg-gray-50" defaultValue="1.2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Starting ZRX Price:</span>
                  <span>1.2 API3 per ZRX</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-sm font-medium">Deposit amounts</div>
            <div className="space-y-2">
              <div className="relative">
                <Input className="bg-gray-50" defaultValue="1" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="rounded-full bg-blue-500 w-5 h-5" />
                    <span className="font-medium">ETH</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">$3,171.38</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    Balance: {token1.balance}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 h-auto py-0"
                  >
                    MAX
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input className="bg-gray-50" defaultValue="2415.7" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="rounded-full bg-green-500 w-5 h-5" />
                    <span className="font-medium">USDT</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">$2,416.71</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    Balance: {token2.balance}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 h-auto py-0"
                  >
                    MAX
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-red-100 hover:bg-red-200 text-red-600"
            disabled
          >
            Insufficient USDT balance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
