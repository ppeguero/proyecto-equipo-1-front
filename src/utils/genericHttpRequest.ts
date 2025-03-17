/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useStorage } from '@vueuse/core';

const token = useStorage('token', '');

const createAxiosInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string;
  if (!baseURL) {
    throw new Error('VITE_API_BASE_URL no está definida en el archivo .env');
    }

    const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig & { addToken?: boolean }) => {

            if (config.addToken !== false) {
                config.headers.set('Authorization', `Bearer ${token.value}`);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) { // temporal
                console.error('No autorizado, redirigiendo...');
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const axiosInstance = createAxiosInstance();

interface ApiRequestParams<T = any> {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';
    url: string;
    data?: T;
    config?: AxiosRequestConfig;
}

export async function apiRequest<T = any, R = AxiosResponse<T>>(
    params: ApiRequestParams<T>
): Promise<R> {
    const { method, url, data, config } = params;

    try {
        let response: AxiosResponse<T>;

        switch (method) {
            case 'get':
            case 'delete':
            case 'head':
            case 'options':
                response = await axiosInstance[method]<T>(url, config);
                break;
            case 'post':
            case 'put':
            case 'patch':
                response = await axiosInstance[method]<T>(url, data, config);
                break;
            default:
                throw new Error(`Método HTTP no soportado: ${method}`);
        }

        return response as R;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(axiosError.message || 'Error en la solicitud HTTP');
    }
}
