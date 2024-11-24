import { Pool } from "@/interfaces/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PoolDetailButton from './components/PoolDetailButton';
import AddPosition from '../AddPosition/components/AddPosition';
import usePoolStore from '@/store/poolStore';

export default function PoolListPage() {
  const { poolList: pools } = usePoolStore();

  return (
    <div className="container mx-auto bg-background text-foreground p-6 flex justify-center">
      <div className="border border-border rounded-lg p-6 w-full">
        <div className="flex space-x-4">
          <h1 className="text-3xl font-bold mb-4 text-primary">Pools</h1>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Pools</TabsTrigger>
            <TabsTrigger value="my">My Pools</TabsTrigger>
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
                  {pools && (pools as Pool[]).map((pool) => (
                    <TableRow key={pool.id} className="border-b border-border hover:bg-accent/10">
                      <TableCell>
                        <PoolDetailButton pool={pool} />
                      </TableCell>
                      <TableCell className="sm:table-cell">${pool.tvl}</TableCell>
                      <TableCell className="hidden md:table-cell">${pool.volume}</TableCell>
                      <TableCell className="hidden md:table-cell">${pool.fees}</TableCell>
                      <TableCell>{pool.apr}%</TableCell>
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
        <div className="w-full flex justify-end">
          <AddPosition isCreatePool={true} className="md:w-fit" />
        </div>
      </div>
    </div>
  );
}

