import { indexerInstance as axios } from './index';

export const getPoolList = async () => {
    const response = await axios.get('pool');

    console.log(response.data.data);
}