import axios from 'axios';

let baseUrl = process.env.NEXT_PUBLIC_AI_URL || 'https://agriflow-ai-694788844994.asia-southeast1.run.app';
if (baseUrl && !baseUrl.endsWith('/api/v1')) {
  baseUrl = `${baseUrl}/api/v1`;
}

const aiApi = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export default aiApi;
