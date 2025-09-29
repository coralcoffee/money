import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from 'oidc-client-ts';
function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${process.env.PUBLIC_AUTHORITY ?? ''}:${process.env.PUBLIC_CLIENT_ID ?? ''}`,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export class ApiBase {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = process.env.PUBLIC_API_BASE_URL ?? '';

    this.axiosInstance = axios.create({
      baseURL: `${baseURL}/api`,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const user = getUser();
        if (user && user.access_token) {
          config.headers = config.headers ?? {};
          config.headers['Authorization'] = `Bearer ${user?.access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

const apiBase = new ApiBase();

export default apiBase;
