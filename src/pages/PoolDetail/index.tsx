import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pool } from "@/interfaces/pool";
import AddPosition from '../AddPosition/components/AddPosition';
import { Button } from "@/components/ui/button";
import usePoolStore from '@/store/poolStore';
import { useEffect, useState } from 'react';

export default function PoolDetail() {
  const { poolId } = useParams<{ poolId: string }>();
  const { poolList } = usePoolStore();
  const [pool, setPool] = useState<Pool | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (poolList.length > 0) {
      const pool = (poolList as Pool[]).find((pool) => pool.id === poolId)!;
      setPool(pool);
    }
  }, [poolList]);

  const onClose = () => {
    navigate(-1);
  };

  return (
    <div className="bg-background text-foreground min-h-[700px] flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">Go back</span>
            </Button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <img
                src={pool?.token0.image}
                alt={pool?.token0.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background shadow-sm"
              />
              <img
                src={pool?.token1.image}
                alt={pool?.token1.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-background shadow-sm"
              />
            </div>
            <div className="w-5 sm:w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-primary">
              {pool?.token0.symbol}/{pool?.token1.symbol}
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">Trade Fee: <span className="font-semibold text-primary">{pool?.friendlyFee}</span></p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Inspect pair details and manage your liquidity
            </p>
          </div>

          <div className="space-y-4 sm:space-y-8">
            <Card className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-primary">
                    Pool Composition
                  </h2>
                  <div className="grid gap-3 sm:gap-6">
                    {[pool?.token0, pool?.token1].map((token, index) => (
                      <div key={token?.symbol} className="bg-accent/10 p-3 sm:p-4 rounded-lg">
                        <div className="flex justify-between items-center text-muted-foreground mb-1 sm:mb-2">
                          <span className="text-sm sm:text-base font-medium">{token?.name}</span>
                          <Button
                            variant="link"
                            className="flex items-center text-primary hover:text-primary/80 transition-colors text-xs sm:text-sm p-0 h-auto"
                          >
                            Explorer
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-base sm:text-2xl font-bold text-primary">
                            {index === 0 ? pool?.token0Amount : pool?.token1Amount} {token?.symbol}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            $21.3{index + 1}M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    { label: "Liquidity", value: pool?.tvl },
                    { label: "Total Volume", value: pool?.volume },
                    { label: "Total Fee", value: pool?.fees },
                    { label: "APR", value: pool?.apr, highlight: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-xs sm:text-sm text-muted-foreground block mb-1">{item.label}</span>
                      <div className={`text-sm sm:text-2xl font-bold ${item.highlight ? 'text-green-600' : 'text-primary'}`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-primary">My Position</h2>
                {pool && <AddPosition isCreatePool={false} poolInfo={pool} />}
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

