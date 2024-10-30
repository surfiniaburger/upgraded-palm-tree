// app/api/lib/utils.ts
import {APIError} from './errors'

export const validateConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiKey) {
    throw new APIError('API key is not configured', 500);
  }
  return apiKey;
};

export interface UploadResponse {
  message: string;
  recordId: string;
}

export const createApiClient = (endpoint: string) => {
  const apiKey = validateConfig();
  const baseUrl = 'https://34.49.13.123.nip.io/zk/v1';
  
  return {
    get: async <T>(path: string = '') => {
      const response = await fetch(`${baseUrl}${endpoint}${path}`, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new APIError(
          `API request failed with status ${response.status}`,
          response.status
        );
      }

      return response.json() as Promise<T>;
    },

    post: async <T>(data?: any) => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new APIError(
          `API request failed with status ${response.status}`,
          response.status
        );
      }

      return response.json() as Promise<T>;
    },
  };
};