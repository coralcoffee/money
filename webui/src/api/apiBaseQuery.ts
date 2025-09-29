import apiBase from './ApiBase';
import { AxiosError } from 'axios';

// Define the expected argument types for the base query
export interface BaseQueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
}

// Custom base query that uses ApiBase
export const apiBaseQuery = async (args: string | BaseQueryArgs) => {
  try {
    const { url, method = 'GET', body, params } = typeof args === 'string' ? { url: args } : args;
    
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await apiBase.get(url, { params });
        break;
      case 'POST':
        response = await apiBase.post(url, body, { params });
        break;
      case 'PUT':
        response = await apiBase.put(url, body, { params });
        break;
      case 'DELETE':
        response = await apiBase.delete(url, { params });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return { data: response.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError;
    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data || error.message,
      },
    };
  }
};

export default apiBaseQuery;