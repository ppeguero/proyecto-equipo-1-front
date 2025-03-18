import type { Medicamento, MedicamentoCreateDto, MedicamentoUpdateDto } from "../interfaces/Medicamento";
import { apiRequest } from "../utils/genericHttpRequest";

export class MedicamentoService {
  async getAll(): Promise<Medicamento[]> {
    const response = await apiRequest<Medicamento[]>({
      method: "get",
      url: "/Medicamentos",
    });
    return response.data;
  }

  async getById(id: number): Promise<Medicamento> {
    const response = await apiRequest<Medicamento>({
      method: "get",
      url: `/Medicamentos/${id}`,
    });
    return response.data;
  }

  async create(medicamento: MedicamentoCreateDto): Promise<Medicamento> {
    const response = await apiRequest<Medicamento>({
      method: "post",
      url: "/Medicamentos",
      data: medicamento,
    });
    return response.data;
  }

  async update(id: number, medicamento: MedicamentoUpdateDto): Promise<void> {
    await apiRequest({
      method: "put",
      url: `/Medicamentos/${id}`,
      data: medicamento,
    });
  }

  async delete(id: number): Promise<void> {
    await apiRequest({
      method: "delete",
      url: `/Medicamentos/${id}`,
    });
  }
}

export const medicamentoService = new MedicamentoService();