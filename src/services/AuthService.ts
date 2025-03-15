import { apiRequest } from "@/utils/genericHttpRequest";
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
}

export const authService = {
    login: async (credentials: LoginData): Promise<AxiosResponse<LoginResponse>> => {
        return apiRequest<LoginData, AxiosResponse<LoginResponse>>({
            method: 'post',
            url: '/Auth/login',
            data: credentials,
        });
    },

    logout: async () => {
        return apiRequest({
            method: 'post',
            url: '/Auth/logout',
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
