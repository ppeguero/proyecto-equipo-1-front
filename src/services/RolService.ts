import { apiRequest } from '@/utils/genericHttpRequest';
import type { AxiosResponse } from 'axios';
import type { RolDto } from '@/interfaces/RolDto';

export const rolService = {
    getAll: async (): Promise<RolDto[]> => {
        const response = await apiRequest<null, AxiosResponse<RolDto[]>>({
            method: 'get',
            url: '/Roles',
            config: { addToken: true },
        });
        return response.data;
    }
};