import { baseClient, ApiError } from './clients';
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

export type BaseQueryResult<T = unknown> = BaseQueryResponse<T> | ApiError;

export function isBaseQueryError<T>(result: BaseQueryResult<T>): result is ApiError {
  return 'error' in result;
}

export const baseQuery = async <TResponse = unknown, TData = unknown>(
  args: string | BaseQueryArgs<TData>,
): Promise<BaseQueryResult<TResponse>> => {
  try {
    const queryArgs: BaseQueryArgs<TData> = typeof args === 'string' ? { url: args, method: 'GET' } : args;

    const { url, method = 'GET', body, params, config } = queryArgs;

    const requestConfig: AxiosRequestConfig = {
      ...config,
      params: params || config?.params,
    };

    let response;
    const upperMethod = method.toUpperCase() as HttpMethod;

    switch (upperMethod) {
      case 'GET':
        response = await baseClient.get<TResponse>(url, requestConfig);
        break;
      case 'POST':
        response = await baseClient.post<TResponse, TData>(url, body, requestConfig);
        break;
      case 'PUT':
        response = await baseClient.put<TResponse, TData>(url, body, requestConfig);
        break;
      case 'PATCH':
        response = await baseClient.patch<TResponse, TData>(url, body, requestConfig);
        break;
      case 'DELETE':
        response = await baseClient.delete<TResponse>(url, requestConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return {
      data: response,
      status: 200,
    };
  } catch (error) {
    return error as ApiError;
  }
};
