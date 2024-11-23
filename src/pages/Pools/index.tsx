import React from 'react';
import { Pool } from "@/interfaces/pool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import pools from "@/assets/pools.json";
import PoolDetailButton from './components/PoolDetailButton';
import AddPosition from '../AddPosition/components/AddPosition';

export default function PoolListPage() {
  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6 text-primary">Pools</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input placeholder="Search pools" className="max-w-sm bg-accent/20 text-primary placeholder:text-muted-foreground" />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px] bg-accent/20 text-primary border-input">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-background text-primary border-input">
            <SelectItem value="tvl">TVL</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="apr">APR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="w-full bg-accent/10">
          <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Pools</TabsTrigger>
          <TabsTrigger value="my" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Pools</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/10">
                  <TableHead className="text-primary font-semibold">Pool</TableHead>
                  <TableHead className="sm:table-cell text-primary font-semibold">TVL</TableHead>
                  <TableHead className="hidden md:table-cell text-primary font-semibold">Volume (24h)</TableHead>
                  <TableHead className="hidden md:table-cell text-primary font-semibold">Fees (24h)</TableHead>
                  <TableHead className="text-primary font-semibold">APR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.id} className="border-b border-border hover:bg-accent/10">
                    <TableCell>
                      <PoolDetailButton pool={pool} />
                    </TableCell>
                    <TableCell className="sm:table-cell">{pool.tvl}</TableCell>
                    <TableCell className="hidden md:table-cell">{pool.volume}</TableCell>
                    <TableCell className="hidden md:table-cell">{pool.fees}</TableCell>
                    <TableCell>{pool.apr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="my">
          <p className="text-muted-foreground">You have no active pools.</p>
        </TabsContent>
      </Tabs>

      <AddPosition isCreatePool={true} />
    </div>
  );
}

