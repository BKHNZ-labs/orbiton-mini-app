import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Minus, MoveLeft, Plus, X } from 'lucide-react';
import { FeeAmount } from "@/interfaces/fee";
import TokenSelector from "../TokenSelector";
import { useAddPosition } from "./hooks/useAddPosition";
import { useCounterContract } from "@/hooks/useCounterContract";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AddPositionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCreatePool, poolInfo } = location.state || {};

    const {
        createPool,
        setFee,
        setToken0,
        setToken1,
        setCreatePoolParams,
        fee,
        token0,
        token1,
        createPoolParams,
        friendlyFee,
    } = useAddPosition(isCreatePool, poolInfo);

    const { sendIncrement } = useCounterContract();

    const feeTiers = [
        { value: "0.01", feeType: FeeAmount.VERY_LOW },
        { value: "0.05", feeType: FeeAmount.LOW },
        { value: "0.30", feeType: FeeAmount.MEDIUM },
        { value: "1.00", feeType: FeeAmount.HIGH },
    ];

    const getSubmitMessage = () => {
        if (isCreatePool) {
            return "Create pool";
        } else {
            return "Add liquidity";
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6" >
            <Button onClick={() => navigate(-1)} className="mb-4" >
                <div className="flex items-center gap-2" >
                    <MoveLeft />
                    <span>Back</span>
                </div>
            </Button>
            < h1 className="text-2xl font-bold mb-6" > {isCreatePool ? "Create new pool" : "Add Liquidity"} </h1>

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="text-sm font-medium">Select pair</div>
                    <div className="grid grid-cols-2 gap-3">
                        <TokenSelector
                            children={
                                <div className="flex justify-between mb-2">
                                    <Button
                                        variant="outline"
                                        className="text-gray-800 hover:bg-gray-100 gap-2 w-full"
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

                        <TokenSelector
                            children={
                                <div className="flex justify-between mb-2">
                                    <Button
                                        variant="outline"
                                        className="text-gray-800 hover:bg-gray-100 gap-2 w-full"
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
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{friendlyFee}% fee tier</div>
                    </div>

                    {isCreatePool && (
                        <div className="grid grid-cols-4 gap-2">
                            {feeTiers.map((tier) => (
                                <div
                                    key={tier.value}
                                    className={`relative rounded-lg border ${fee === tier.feeType
                                        ? "border-purple-600 bg-purple-50"
                                        : "border-gray-200 bg-gray-50"
                                        } p-3 cursor-pointer`}
                                    onClick={() => setFee(tier.feeType)}
                                >
                                    <div className="text-sm font-medium text-center">
                                        {tier.value}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {!isCreatePool && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Low price</label>
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
                                <div className="text-xs text-gray-500">
                                    {token1.symbol} per {token0.symbol}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">High price</label>
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
                                <div className="text-xs text-gray-500">
                                    {token1.symbol} per {token0.symbol}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!isCreatePool ? (
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Current Price:</span>
                                <span>
                                    1.2 {token1.symbol} per {token0.symbol}
                                </span>
                            </div>
                            <Input className="bg-gray-50" defaultValue="1.2" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Alert className="bg-purple-50 border-purple-200 mb-2">
                            <AlertDescription className="text-purple-700">
                                This pool must be initialized before you can add liquidity. To
                                initialize, select a starting price for the pool. Then, enter
                                your liquidity price range and deposit amount.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Input
                                className="bg-gray-50"
                                value={createPoolParams.initPrice}
                                onChange={(e) =>
                                    setCreatePoolParams({ initPrice: e.target.value })
                                }
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Starting {token1.symbol} Price:</span>
                                <span>
                                    {createPoolParams.initPrice} {token1.symbol} per{" "}
                                    {token0.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!isCreatePool && (
                    <div className="space-y-3">
                        <div className="text-sm font-medium">Deposit amounts</div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input className="bg-gray-50" defaultValue="1" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <img
                                            src={token1.image}
                                            alt={token1.name}
                                            className="w-12 h-12 rounded-full border-2 border-white"
                                        />
                                        <span className="font-medium">{token1.symbol}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                {/* <span className="text-gray-500">$3,171.38</span> */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">
                                        Balance:{" "}
                                        {token1.balance
                                            ? Number(token1.balance) / 10 ** token1.decimals
                                            : 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Input className="bg-gray-50" defaultValue="2415.7" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <img
                                            src={token1.image}
                                            alt={token1.name}
                                            className="w-12 h-12 rounded-full border-2 border-white"
                                        />
                                        <span className="font-medium">{token1.symbol}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                {/* <span className="text-gray-500">$2,416.71</span> */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">
                                        Balance:{" "}
                                        {token1.balance
                                            ? Number(token1.balance) / 10 ** token1.decimals
                                            : 0}
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600"
                    disabled={
                        isCreatePool
                            ? !(getSubmitMessage() === "Create pool")
                            : !(getSubmitMessage() === "Add liquidity")
                    }
                    onClick={isCreatePool ? () => createPool() : () => { }}
                >
                    {getSubmitMessage()}
                </Button>

                <Button
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600"
                    disabled={
                        isCreatePool
                            ? !(getSubmitMessage() === "Create pool")
                            : !(getSubmitMessage() === "Add liquidity")
                    }
                    onClick={sendIncrement}
                >
                    Increment
                </Button>
            </div>
        </div>
    );
}

