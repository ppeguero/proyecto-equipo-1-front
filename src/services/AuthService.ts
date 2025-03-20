import { apiRequest, type CustomAxiosRequestConfig } from "@/utils/genericHttpRequest";
import { type AxiosResponse } from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}


export const authService = {
  login: async (credentials: LoginData): Promise<AxiosResponse<LoginResponse>> => {
    return apiRequest<LoginData, AxiosResponse<LoginResponse>>({
      method: 'post',
      url: '/Auth/login',
      data: credentials,
    });
  },

  logout: async (refreshTokenValue: string) => {
    return apiRequest({
      method: 'post',
      url: '/Auth/logout',
      data: { refreshToken: refreshTokenValue },
      config: { addToken: false } as CustomAxiosRequestConfig

    });
  },

  refreshToken: async (token: string, refreshToken: string): Promise<AxiosResponse<RefreshTokenResponse>> => {
    return apiRequest<{ token: string; refreshToken: string }, AxiosResponse<RefreshTokenResponse>>({
      method: 'post',
      url: '/Auth/refresh',
      data: { token, refreshToken },
      config: { addToken: false } as CustomAxiosRequestConfig,
    });
  },


  // puedes mandar a la funcion un addToken: true si la ruta necesita un token
  // ejemplo
  // apiRequest({
  //     method: 'get',
  //     url: '/Auth/Cliente',
  //     config: { addToken: true },
  // });
};
