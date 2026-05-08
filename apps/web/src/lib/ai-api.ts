import axios from 'axios';

const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default aiApi;