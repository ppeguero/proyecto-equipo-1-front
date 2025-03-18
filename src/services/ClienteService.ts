import type { Cliente, ClienteCreateDto, ClienteUpdateDto } from "../interfaces/Cliente";
import { apiRequest } from "../utils/genericHttpRequest";

export class ClienteService {
  async getAll(): Promise<Cliente[]> {
    const response = await apiRequest<Cliente[]>({
      method: "get",
      url: "/Cliente",
    });
    return response.data.map((cliente) => ({
      ...cliente,
      nombreCompleto: `${cliente.nombre} ${cliente.apellido}`,
    }));
  }

  async getById(id: number): Promise<Cliente> {
    const response = await apiRequest<Cliente>({
      method: "get",
      url: `/Cliente/${id}`,
    });
    return { ...response.data, nombreCompleto: `${response.data.nombre} ${response.data.apellido}` };
  }

  async create(cliente: ClienteCreateDto): Promise<Cliente> {
    const response = await apiRequest<Cliente>({
      method: "post",
      url: "/Cliente",
      data: cliente,
    });
    return {
      ...response.data,
      nombreCompleto: `${response.data.nombre} ${response.data.apellido}`
    };
  }

  async update(id: number, cliente: ClienteUpdateDto): Promise<void> {
    await apiRequest({
      method: "put",
      url: `/Cliente/${id}`,
      data: cliente,
    });
  }

  async delete(id: number): Promise<void> {
    await apiRequest({
      method: "delete",
      url: `/Cliente/${id}`,
    });
  }
}

export const clienteService = new ClienteService();
