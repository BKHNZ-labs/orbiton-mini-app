import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Pool } from '@/interfaces/pool';

type AddPositionProps = {
    isCreatePool: boolean;
    poolInfo?: Pool;
    className?: string;
};

export default function AddPosition({
    isCreatePool,
    poolInfo,
    className,
}: AddPositionProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/add-position', { state: { isCreatePool, poolInfo } });
    };

    return (
        <Button
            onClick={handleClick}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg ${className || ''}`}
        >
            {isCreatePool ? "+ New Pool" : "+ New Position"}
        </Button>
    );
}