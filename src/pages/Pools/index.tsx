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
import { Circle, Search } from "lucide-react";
import AddPosition from "../AddPosition";

export default function Pools() {
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
            <Badge
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Circle className="mr-1 h-4 w-4 text-blue-500" />
              TON
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Circle className="mr-1 h-4 w-4 text-amber-500" />
              DUST
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Circle className="mr-1 h-4 w-4 text-emerald-500" />
              USDT
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <h2 className="font-medium text-gray-900">Pool list</h2>
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <Button>Create pool</Button>
            </div> */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AddPosition />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead>Pair</TableHead>
                  <TableHead className="text-right">TVL</TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Volume (24h)
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Fees (24h)
                  </TableHead>
                  <TableHead className="text-right">APR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <Circle className="h-5 w-5 text-blue-500" />
                        <Circle className="h-5 w-5 text-emerald-500" />
                      </div>
                      
                        TON/USDT
                    </div>
                  </TableCell>
                  <TableCell className="text-right">$42.66M</TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    $8.97M
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    $8.97K
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    24.96%
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <Circle className="h-5 w-5 text-purple-500" />
                        <Circle className="h-5 w-5 text-emerald-500" />
                      </div>
                      
                        tsTON/USDT
                    </div>
                  </TableCell>
                  <TableCell className="text-right">$20.21M</TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    $1M
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    $2.5K
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    23.01%
                  </TableCell>
                </TableRow>
                {/* Additional rows would follow the same pattern */}
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
