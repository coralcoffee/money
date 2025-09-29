import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import { User } from 'oidc-client-ts';

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

// Extended axios config with metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Optimized user retrieval with memoization
let cachedUser: User | null = null;
let userCacheTime = 0;
const USER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getUser(): User | null {
  const now = Date.now();
  
  // Return cached user if still valid
  if (cachedUser && (now - userCacheTime) < USER_CACHE_DURATION) {
    return cachedUser;
  }
  
  try {
    const oidcStorage = localStorage.getItem(
      `oidc.user:${process.env.PUBLIC_AUTHORITY ?? ''}:${process.env.PUBLIC_CLIENT_ID ?? ''}`,
    );
    
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

// Clear user cache when needed
export function clearUserCache(): void {
  cachedUser = null;
  userCacheTime = 0;
}

export class ApiBase {
  private axiosInstance: AxiosInstance;
  private requestQueue = new Map<string, Promise<AxiosResponse>>();

  constructor() {
    const baseURL = process.env.PUBLIC_API_BASE_URL ?? '';

    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/api`,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor with better error handling
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const user = getUser();
        if (user?.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
        }
        
        // Add request timestamp for debugging
        if (process.env.NODE_ENV === 'development') {
          (config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() };
        }
        
        return config;
      },
      (error: AxiosError) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(this.transformError(error));
      },
    );

    // Response interceptor with better error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        const extendedConfig = response.config as ExtendedAxiosRequestConfig;
        if (process.env.NODE_ENV === 'development' && extendedConfig.metadata?.startTime) {
          const duration = Date.now() - extendedConfig.metadata.startTime;
          console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        
        return response;
      },
      (error: AxiosError) => {
        // Clear user cache on 401 errors
        if (error.response?.status === 401) {
          clearUserCache();
        }
        
        return Promise.reject(this.transformError(error));
      },
    );
  }

  private transformError(error: AxiosError): ApiError {
    const status = error.response?.status || 500;
    const errorData = error.response?.data as { message?: string } | undefined;
    const message = errorData?.message || error.message || 'An error occurred';
    const data = error.response?.data;

    return {
      status,
      message,
      data,
    };
  }

  // Request deduplication for GET requests
  private getRequestKey(method: string, url: string, params?: Record<string, unknown>): string {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  public async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Request deduplication for GET requests
    const requestKey = this.getRequestKey('GET', url, config?.params as Record<string, unknown>);
    
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey) as Promise<AxiosResponse<T>>;
    }
    
    const request = this.axiosInstance.get<T>(url, config);
    this.requestQueue.set(requestKey, request);
    
    try {
      const response = await request;
      return response;
    } finally {
      // Clean up after request completes
      setTimeout(() => this.requestQueue.delete(requestKey), 100);
    }
  }

  public async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // Additional utility methods
  public async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  // Method to clear request cache manually
  public clearRequestCache(): void {
    this.requestQueue.clear();
  }

  // Method to get axios instance for advanced usage
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

const apiBase = new ApiBase();

export default apiBase;
