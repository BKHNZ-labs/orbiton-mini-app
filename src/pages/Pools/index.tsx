import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import AddPosition from "../AddPosition";
import tokens from "@/assets/tokens.json";
import { Pool } from "@/interfaces/pool";
import PoolDetail from "../PoolDetail";
import { useState } from "react";
import pools from "@/assets/pools.json";

export default function Pools() {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">Pools</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="text-gray-500 flex items-center">Filters</div>
            {tokens.map((token) => (
              <Badge
                key={token.id}
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-4 h-4 mr-1 rounded-full"
                />
                {token.symbol}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <h2 className="font-medium text-gray-900">Pool list</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <AddPosition isCreatedPool={true} />
            </div>
          </div>

          <PoolDetail
        isOpen={selectedPool !== null}
        onClose={() => {
          setSelectedPool(null);
        }}
        pool={(selectedPool ? selectedPool : pools[0]) as any}
        key={selectedPool?.id}
      />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead>Pair</TableHead>
                  <TableHead className="text-right">TVL</TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Volume
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Fees
                  </TableHead>
                  <TableHead className="text-right">APR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div
                        className="flex items-center gap-2"
                        onClick={() => setSelectedPool(pool as any)}
                      >
                        <div className="flex -space-x-1">
                          <img
                            src={pool.token0.image}
                            alt={pool.token0.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <img
                            src={pool.token1.image}
                            alt={pool.token1.name}
                            className="w-5 h-5 rounded-full"
                          />
                        </div>
                        {`${pool.token0.symbol}/${pool.token1.symbol}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{pool.tvl}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {pool.volume}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {pool.fees}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {pool.apr}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              View all
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
