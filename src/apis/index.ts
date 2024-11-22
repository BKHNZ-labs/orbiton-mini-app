import axios from 'axios';
import axiosRetry from 'axios-retry';

const instance = axios.create({
  baseURL: "https://testnet.toncenter.com/api/v3/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
  
});

axiosRetry(instance, { retries: 3 });

export default instance;
