import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pool } from "@/interfaces/pool";
import { DialogTitle } from "@radix-ui/react-dialog";
import AddPosition from "../AddPosition";
import { ScrollArea } from "@/components/ui/scroll-area";

type PoolDetailProps = {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
};

export default function PoolDetail({ pool, isOpen, onClose }: PoolDetailProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-white text-gray-900 overflow-hidden flex flex-col h-[100dvh]">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <DialogTitle className="sr-only">Pool Details</DialogTitle>
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <div className="flex items-center space-x-2">
              <img
                src={pool.token0.image}
                alt={pool.token0.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <img
                src={pool.token1.image}
                alt={pool.token1.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">
                {pool.token0.symbol}/{pool.token1.symbol}
              </h1>
              <p className="text-gray-600">Trade Fee: {pool.friendlyFee}</p>
              <p className="text-gray-600">
                Inspect pair details and manage your liquidity
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-50 border-gray-200 p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Pool Composition
                  </h2>
                  <div className="space-y-4">
                    {[pool.token0, pool.token1].map((token, index) => (
                      <div key={token.symbol}>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>{token.name}</span>
                          <a
                            href="#"
                            className="flex items-center hover:text-gray-900"
                          >
                            Explorer
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                        <div className="flex flex-col justify-between items-baseline">
                          <span className="text-2xl font-bold">
                            {index === 0
                              ? pool.token0Amount
                              : pool.token1Amount}{" "}
                            {token.symbol}
                          </span>
                          <span className="text-gray-600">
                            $21.3{index + 1}M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600">Liquidity</span>
                    <div className="text-2xl font-bold">{pool.tvl}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Total Volume</span>
                      <div className="text-2xl font-bold">{pool.volume}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Fee</span>
                      <div className="text-2xl font-bold">{pool.fees}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600">APR</span>
                    <div className="text-2xl font-bold text-green-600">
                      {pool.apr}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-50 border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">My Position</h2>
                <AddPosition isCreatedPool={false} poolInfo={pool} />
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
