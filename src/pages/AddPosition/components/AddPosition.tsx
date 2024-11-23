import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Pool } from '@/interfaces/pool';

type AddPositionProps = {
    isCreatePool: boolean;
    poolInfo?: Pool;
};

export default function AddPosition({
    isCreatePool,
    poolInfo,
}: AddPositionProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/add-position', { state: { isCreatePool, poolInfo } });
    };

    return (
        <Button
            onClick={handleClick}
            className="w-full py-2 md:px-4 bg-[#1a1a1a] text-white rounded-2xl"
        >
            {isCreatePool ? "+ New Pool" : "+ New Position"}
        </Button>
    );
}

