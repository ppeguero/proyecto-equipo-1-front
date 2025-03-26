import { defineStore } from 'pinia';
import { ref } from 'vue';
import { clienteService } from '@/services/ClienteService';
import type { Cliente, ClienteCreateDto, ClienteUpdateDto } from '@/interfaces/Cliente';

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref<Cliente[]>([]);

  const fetchClientes = async () => {
    try {
      clientes.value = await clienteService.getAll();
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  };

  const addCliente = async (cliente: ClienteCreateDto) => {
    try {
      await clienteService.create(cliente);
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      throw error;
    }
  };

  const updateCliente = async (id: number, cliente: ClienteUpdateDto) => {
    try {
      await clienteService.update(id, cliente);
      const updatedCliente = await clienteService.getById(id);
      const index = clientes.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        clientes.value[index] = updatedCliente;
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      await clienteService.delete(id);
      clientes.value = clientes.value.filter((c) => c.id !== id);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  };

  return {
    clientes,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  };
});
