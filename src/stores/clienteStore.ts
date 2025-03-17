import { defineStore } from 'pinia';
import { clienteService } from '@/services/ClienteService';
import type { Cliente, ClienteCreateDto, ClienteUpdateDto } from '@/interfaces/Cliente';

export const useClienteStore = defineStore('cliente', {
  state: () => ({
    clientes: [] as Cliente[],
  }),

  actions: {
    async fetchClientes() {
      try {
        this.clientes = await clienteService.getAll();
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
      }
    },

    async addCliente(cliente: ClienteCreateDto) {
      try {
        await clienteService.create(cliente);
      } catch (error) {
        console.error('Error al agregar cliente:', error);
        throw error;
      }
    },

    async updateCliente(id: number, cliente: ClienteUpdateDto) {
      try {
        await clienteService.update(id, cliente);
        const updatedCliente = await clienteService.getById(id);
        const index = this.clientes.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.clientes[index] = updatedCliente;
        }
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw error;
      }
    },

    async deleteCliente(id: number) {
      try {
        await clienteService.delete(id);
        this.clientes = this.clientes.filter((c) => c.id !== id);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        throw error;
      }
    },
  },
});
