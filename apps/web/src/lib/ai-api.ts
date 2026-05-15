import axios from 'axios';

const aiApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_AI_URL ||
    'https://agriflow-ai-694788844994.asia-southeast1.run.app/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default aiApi;
