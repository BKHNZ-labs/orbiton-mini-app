import { indexerInstance as axios } from './index';

export type PoolResponse = {
    _id: string;
    poolAddress: string;
    jetton0WalletAddress: string;
    jetton1WalletAddress: string;
    fee: number;
    tickSpacing: number;
    liquidity: string;
    totalVolume: string;
    totalFee: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    jetton0MasterAddress: string;
    jetton1MasterAddress: string;
} 

export const getPoolList = async () => {
    const response = await axios.get('pool');

    const poolList: PoolResponse[] = response.data.data;
    return poolList;
}

/*
{
    "_id": "6741e9f2d31fbe8349f42dc6",
    "poolAddress": "EQBTrpExxiypM9j__IHBPJGp87FSf8fHY3HKldQ4b7Yf0qoa",
    "jetton0WalletAddress": "EQB9jClOFvIdZr9pZPj0p74V0boSpFNrpuc863fQ08Ob6zp0",
    "jetton1WalletAddress": "EQDK6jK64FWO9Q7V16tLq9cBA3Wup3X3JxFm6p45ETi4vrOE",
    "fee": 3000,
    "tickSpacing": 60,
    "liquidity": "0",
    "totalVolume": "0",
    "totalFee": "0",
    "createdAt": "2024-11-23T14:42:58.092Z",
    "updatedAt": "2024-11-23T16:48:21.384Z",
    "__v": 0,
    "jetton0MasterAddress": "EQBrQSheyrZrHNaCprHELiC0hH-JPmqGaYkhpW2Mlt17EMcL"
}
*/