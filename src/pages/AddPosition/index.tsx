import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Minus, MoveLeft, Plus, X } from 'lucide-react';
import { FeeAmount } from "@/interfaces/fee";
import TokenSelector from "../TokenSelector";
import { useAddPosition } from "./hooks/useAddPosition";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

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
        <div className="max-w-xl mx-auto p-4 sm:p-6">
            <Button onClick={() => navigate(-1)} className="mb-4 px-2 py-1 h-auto" variant="ghost">
                <MoveLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Back</span>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{isCreatePool ? "Create new pool" : "Add Liquidity"}</h1>

            <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-3">
                    <div className="text-sm font-medium">Select pair</div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <TokenSelector
                            children={
                                <Button
                                    variant="outline"
                                    className="w-full h-auto py-2 px-3 text-gray-800 hover:bg-gray-100"
                                >
                                    <img
                                        src={token0.image}
                                        alt={token0.name}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white mr-2"
                                    />
                                    <span className="text-sm sm:text-base">{token0.symbol}</span>
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                </Button>
                            }
                            onSetToken={setToken0}
                        />

                        <TokenSelector
                            children={
                                <Button
                                    variant="outline"
                                    className="w-full h-auto py-2 px-3 text-gray-800 hover:bg-gray-100"
                                >
                                    <img
                                        src={token1.image}
                                        alt={token1.name}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white mr-2"
                                    />
                                    <span className="text-sm sm:text-base">{token1.symbol}</span>
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                </Button>
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {feeTiers.map((tier) => (
                                <div
                                    key={tier.value}
                                    className={`relative rounded-lg border ${
                                        fee === tier.feeType
                                            ? "border-purple-600 bg-purple-50"
                                            : "border-gray-200 bg-gray-50"
                                    } p-2 sm:p-3 cursor-pointer text-center`}
                                    onClick={() => setFee(tier.feeType)}
                                >
                                    <div className="text-xs sm:text-sm font-medium">
                                        {tier.value}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!isCreatePool && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Price Range</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500">Low price</div>
                                    <div className="relative">
                                        <Input className="bg-gray-50 pr-12 text-sm" defaultValue="2092.3024" />
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500">High price</div>
                                    <div className="relative">
                                        <Input className="bg-gray-50 pr-12 text-sm" defaultValue="5563.4375" />
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {token1.symbol} per {token0.symbol}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Current Price:</span>
                                <span>
                                    1.2 {token1.symbol} per {token0.symbol}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {isCreatePool && (
                    <div>
                        <Alert className="bg-purple-50 border-purple-200 mb-2">
                            <AlertDescription className="text-purple-700 text-xs sm:text-sm">
                                This pool must be initialized before you can add liquidity. To
                                initialize, select a starting price for the pool. Then, enter
                                your liquidity price range and deposit amount.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Input
                                className="bg-gray-50 text-sm"
                                value={createPoolParams.initPrice}
                                onChange={(e) =>
                                    setCreatePoolParams({ initPrice: e.target.value })
                                }
                            />
                            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
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
                        {[token0, token1].map((token, index) => (
                            <div key={token.symbol} className="space-y-1">
                                <div className="relative">
                                    <Input className="bg-gray-50 pr-20 text-sm" defaultValue={index === 0 ? "1" : "2415.7"} />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                        <img
                                            src={token.image}
                                            alt={token.name}
                                            className="w-5 h-5 rounded-full border border-white mr-1"
                                        />
                                        <span className="text-xs font-medium">{token.symbol}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                        Balance: {token.balance ? Number(token.balance) / 10 ** token.decimals : 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    className="w-full"
                    disabled={
                        isCreatePool
                            ? !(getSubmitMessage() === "Create pool")
                            : !(getSubmitMessage() === "Add liquidity")
                    }
                    onClick={isCreatePool ? () => createPool() : () => {}}
                >
                    {getSubmitMessage()}
                </Button>
            </Card>
        </div>
    );
}

