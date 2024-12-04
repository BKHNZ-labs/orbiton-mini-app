import { Link } from 'react-router-dom';
import { Pool } from "@/interfaces/pool";

type PoolDetailProps = {
    pool: Pool;
};

export default function PoolDetailButton({ pool }: PoolDetailProps) {
    return (
        <Link to={`/pool/${pool?.id}`} className="flex items-center space-x-2">
            <div className="flex -space-x-2">
                <img
                    src={pool?.token0?.image}
                    alt={pool?.token0?.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                    src={pool?.token1?.image}
                    alt={pool?.token1?.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                />
            </div>
            <div>
                <span className="font-medium">
                    {pool?.token0?.symbol}/{pool?.token1?.symbol}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                    {pool?.friendlyFee}
                </span>
            </div>
        </Link>
    );
}

