import apiBase from './ApiBase';
import { ApiError } from './ApiBase';
import { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface BaseQueryArgs<TData = unknown> {
  url: string;
  method?: HttpMethod;
  body?: TData;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export interface BaseQueryResponse<T = unknown> {
  data: T;
  status?: number;
  statusText?: string;
}

export interface BaseQueryError {
  error: ApiError;
}

// Result type combining success and error cases
export type BaseQueryResult<T = unknown> = BaseQueryResponse<T> | BaseQueryError;

// Type guard to check if response is an error
export function isBaseQueryError<T>(result: BaseQueryResult<T>): result is BaseQueryError {
  return 'error' in result;
}

// Optimized base query with better type safety and performance
export const apiBaseQuery = async <TResponse = unknown, TData = unknown>(
  args: string | BaseQueryArgs<TData>
): Promise<BaseQueryResult<TResponse>> => {
  try {
    // Normalize arguments
    const queryArgs: BaseQueryArgs<TData> = typeof args === 'string' 
      ? { url: args, method: 'GET' } 
      : args;
    
    const { url, method = 'GET', body, params, config } = queryArgs;
    
    // Build request config
    const requestConfig: AxiosRequestConfig = {
      ...config,
      params: params || config?.params,
    };
    
    // Execute request based on method with proper typing
    let response;
    const upperMethod = method.toUpperCase() as HttpMethod;
    
    switch (upperMethod) {
      case 'GET':
        response = await apiBase.get<TResponse>(url, requestConfig);
        break;
      case 'POST':
        response = await apiBase.post<TResponse, TData>(url, body, requestConfig);
        break;
      case 'PUT':
        response = await apiBase.put<TResponse, TData>(url, body, requestConfig);
        break;
      case 'PATCH':
        response = await apiBase.patch<TResponse, TData>(url, body, requestConfig);
        break;
      case 'DELETE':
        response = await apiBase.delete<TResponse>(url, requestConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    // Return successful response
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
    
  } catch (error) {
    // ApiBase already transforms errors to ApiError format
    const apiError = error as ApiError;
    
    return {
      error: {
        status: apiError.status || 500,
        message: apiError.message || 'An unexpected error occurred',
        data: apiError.data,
      },
    };
  }
};

// Convenience methods for common HTTP operations with better typing
export const apiGet = async <T = unknown>(
  url: string, 
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<BaseQueryResult<T>> => {
  return apiBaseQuery<T>({ url, method: 'GET', params, config });
};

export const apiPost = async <TResponse = unknown, TData = unknown>(
  url: string,
  body?: TData,
  config?: AxiosRequestConfig
): Promise<BaseQueryResult<TResponse>> => {
  return apiBaseQuery<TResponse, TData>({ url, method: 'POST', body, config });
};

export const apiPut = async <TResponse = unknown, TData = unknown>(
  url: string,
  body?: TData,
  config?: AxiosRequestConfig
): Promise<BaseQueryResult<TResponse>> => {
  return apiBaseQuery<TResponse, TData>({ url, method: 'PUT', body, config });
};

export const apiPatch = async <TResponse = unknown, TData = unknown>(
  url: string,
  body?: TData,
  config?: AxiosRequestConfig
): Promise<BaseQueryResult<TResponse>> => {
  return apiBaseQuery<TResponse, TData>({ url, method: 'PATCH', body, config });
};

export const apiDelete = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<BaseQueryResult<T>> => {
  return apiBaseQuery<T>({ url, method: 'DELETE', params, config });
};

export default apiBaseQuery;