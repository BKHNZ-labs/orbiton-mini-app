import { Pool } from "@/interfaces/pool";
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
import PoolDetailButton from './components/PoolDetailButton';
import AddPosition from '../AddPosition/components/AddPosition';
import usePoolStore from '@/store/poolStore';

export default function PoolListPage() {
  const { poolList: pools } = usePoolStore();

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <div className="flex space-x-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">Pools</h1>
      </div>

      <Tabs defaultValue="all" className="mb-6">
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
  );
}

