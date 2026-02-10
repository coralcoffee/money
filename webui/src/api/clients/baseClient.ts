import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { User } from 'oidc-client-ts';
import { getApiBaseUrl } from '../../runtime/apiRuntime';

const authority = import.meta.env.VITE_AUTHORITY ?? import.meta.env.PUBLIC_AUTHORITY ?? '';
const clientId = import.meta.env.VITE_CLIENT_ID ?? import.meta.env.PUBLIC_CLIENT_ID ?? '';
const oidcStorageKey = `oidc.user:${authority}:${clientId}`;

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  status: number;
  error: ApiErrorInfo;
  validationErrors?: Record<string, string[]>;
}

export interface ApiErrorInfo {
  code?: string;
  message?: string;
  details?: string;
  data?: Record<string, unknown>;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

let cachedUser: User | null = null;
let userCacheTime = 0;
const USER_CACHE_DURATION = 5 * 60 * 1000;

function getUser(): User | null {
  const now = Date.now();

  if (cachedUser && now - userCacheTime < USER_CACHE_DURATION) {
    return cachedUser;
  }

  try {
    const oidcStorage = localStorage.getItem(oidcStorageKey);
    if (!oidcStorage) {
      cachedUser = null;
      return null;
    }

    cachedUser = User.fromStorageString(oidcStorage);
    userCacheTime = now;
    return cachedUser;
  } catch (error) {
    console.warn('Failed to parse user from storage:', error);
    cachedUser = null;
    return null;
  }
}

export function clearUserCache(): void {
  cachedUser = null;
  userCacheTime = 0;
  localStorage.removeItem(oidcStorageKey);
}

export class BaseClient {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || getApiBaseUrl(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.baseURL = getApiBaseUrl();

        const user = getUser();
        if (user && !user.expired) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }

        if (import.meta.env.DEV) {
          (config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() };
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.transformError(error));
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const extendedConfig = response.config as ExtendedAxiosRequestConfig;
        if (import.meta.env.DEV && extendedConfig.metadata?.startTime) {
          const duration = Date.now() - extendedConfig.metadata.startTime;
          console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }

        return response.data;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          clearUserCache();
          // window.dispatchEvent(new Event('unauthorized'));
        }

        return Promise.reject(this.transformError(error));
      },
    );
  }

  private transformError(error: AxiosError): ApiError {
    const status = error.response?.status || 500;
    const responseData = error.response?.data as { error: ApiErrorInfo };

    const apiErrorInfo: ApiErrorInfo = responseData?.error || {
      message: error.message || 'An unknown error occurred',
    };

    return {
      status,
      error: apiErrorInfo,
    };
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Response interceptor already unwraps response.data
    return (await this.axiosInstance.get<T>(url, config)) as unknown as T;
  }

  public async post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    // Response interceptor already unwraps response.data
    return (await this.axiosInstance.post<T>(url, data, config)) as unknown as T;
  }

  public async put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    // Response interceptor already unwraps response.data
    return (await this.axiosInstance.put<T>(url, data, config)) as unknown as T;
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Response interceptor already unwraps response.data
    return (await this.axiosInstance.delete<T>(url, config)) as unknown as T;
  }

  public async patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    // Response interceptor already unwraps response.data
    return (await this.axiosInstance.patch<T>(url, data, config)) as unknown as T;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

const baseClient = new BaseClient();
export default baseClient;
