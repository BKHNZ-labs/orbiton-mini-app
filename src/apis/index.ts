import axios from 'axios';
import axiosRetry from 'axios-retry';

const tonInstance = axios.create({
  baseURL: "https://testnet.toncenter.com/api/v3/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
  
});

const indexerInstance = axios.create({
  baseURL: "https://api.orbiton.fi/api/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
})

axiosRetry(tonInstance, { retries: 3 });
axiosRetry(indexerInstance, { retries: 3 });

export {
  tonInstance,
  indexerInstance
};
