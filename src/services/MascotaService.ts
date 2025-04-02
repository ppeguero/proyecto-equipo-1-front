import type { Consulta, Mascota, MascotaCreateDto, MascotaUpdateDto } from "../interfaces/Mascota";
import { apiRequest } from "../utils/genericHttpRequest";

export class MascotaService {
  async getAll(): Promise<Mascota[]> {
    const response = await apiRequest<Mascota[]>({
      method: "get",
      url: "/Mascotas",
    });
    return response.data;
  }

  async getById(id: number): Promise<Mascota> {
    const response = await apiRequest<Mascota>({
      method: "get",
      url: `/Mascotas/${id}`,
    });
    return response.data;
  }

  async getHistorialCitas(id: number): Promise<Consulta[]> {
    const response = await apiRequest<Consulta[]>({
      method: "get",
      url: `/Mascotas/${id}/historial-citas`,
    });
    return response.data;
  }

  // async getByCliente(clienteId: number): Promise<Mascota[]> {
  //   const response = await apiRequest<Mascota[]>({
  //     method: "get",
  //     url: `/Mascotas/dueño/${clienteId}`,
  //   });
  //   return response.data;
  // }

  async create(mascota: MascotaCreateDto): Promise<Mascota> {
    const formData = new FormData();
    formData.append("Id", "0");
    formData.append("Nombre", mascota.nombre);
    formData.append("Especie", mascota.especie);
    formData.append("Raza", mascota.raza);
    formData.append("FechaNacimiento", new Date(mascota.fechaNacimiento).toISOString());
    formData.append("ClienteId", mascota.clienteId.toString());
    formData.append("FechaRegistro", new Date().toISOString());
    if (mascota.imagenFile) {
      formData.append("ImagenFile", mascota.imagenFile);
    }
    formData.append("UrlImagen", "xd");

    try {
      const response = await apiRequest<Mascota>({
        method: "post",
        url: "/Mascotas",
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
      return response.data;
    } catch (error) {
      // console.error("Error details en create:", error.response?.data || error.message);
      throw error;
    }
  }

  async update(id: number, mascota: MascotaUpdateDto): Promise<void> {
    const formData = new FormData();
    formData.append("Id", String(id));
    formData.append("Nombre", mascota.nombre);
    formData.append("Especie", mascota.especie);
    formData.append("Raza", mascota.raza);
    formData.append("FechaNacimiento", new Date(mascota.fechaNacimiento).toISOString());
    formData.append("ClienteId", mascota.clienteId.toString());
    if (mascota.imagenFile) {
      formData.append("ImagenFile", mascota.imagenFile);
    }
    if (mascota.urlImagen) {
      formData.append("UrlImagen", mascota.urlImagen);
    }
    try {
      await apiRequest({
        method: "put",
        url: `/Mascotas/${id}`,
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
    } catch (error) {
      // console.error("Error details:", error.response?.data);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await apiRequest({
      method: "delete",
      url: `/Mascotas/${id}`,
    });
  }
}

export const mascotaService = new MascotaService();
