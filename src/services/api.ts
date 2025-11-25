import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";

interface IRequestService {
  base_url: string;

  post(path: string, data: unknown, token?: CancelTokenSource, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  get(path: string, options?: AxiosRequestConfig, token?: CancelTokenSource): Promise<AxiosResponse>;

  put(path: string, data: unknown, token?: CancelTokenSource): Promise<AxiosResponse>;

  delete(path: string, token?: CancelTokenSource): Promise<AxiosResponse>;

  generateToken(): CancelTokenSource;

  generatePath(path: string): string;
}

class RequestService implements IRequestService {
  base_url = import.meta.env.VITE_API_URL;

  constructor() {
    this.base_url = import.meta.env.VITE_API_URL;
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await axios.post(`${this.base_url}/Auth/refreshToken`, { token: refreshToken });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);

            originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;

            return axios(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.href = "/sign-in";

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`; // Ensuring we're correctly defining the header
    }

    return config;
  };

  post(
    path: string,
    data?: unknown,
    token = this.generateToken(),
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    return axios.post(this.generatePath(path), data, {
      cancelToken: token?.token,
      ...config,
    });
  }

  get(path: string, options: AxiosRequestConfig = {}, token = this.generateToken()): Promise<AxiosResponse> {
    return axios.get(this.generatePath(path), {
      cancelToken: token?.token,
      ...options,
    });
  }

  put(path: string, data?: unknown, token = this.generateToken()): Promise<AxiosResponse> {
    return axios.put(this.generatePath(path), data, {
      cancelToken: token?.token,
    });
  }

  patch(path: string, data?: unknown, token = this.generateToken()): Promise<AxiosResponse> {
    return axios.patch(this.generatePath(path), data, {
      cancelToken: token?.token,
    });
  }

  delete(path: string, token = this.generateToken()): Promise<AxiosResponse> {
    return axios.delete(this.generatePath(path), {
      cancelToken: token?.token,
    });
  }

  generateToken(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  generatePath(path: string): string {
    return `${this.base_url}${path}`;
  }
}

const api = new RequestService();

export { api };
