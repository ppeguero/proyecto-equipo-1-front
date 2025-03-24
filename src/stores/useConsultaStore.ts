import { defineStore } from 'pinia';
import { ref } from 'vue';
import { consultaService } from '@/services/ConsultaService';
import type { Consulta, ConsultaPostDto, ConsultaUpdateDto } from '@/services/ConsultaService';

export const useConsultaStore = defineStore('consulta', () => {
    const consultas = ref<Consulta[]>([]);
    const consulta = ref<Consulta | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchAllConsultas = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await consultaService.getAll();
            console.log(response);
            consultas.value = response.data;
            console.log(consultas.value);
        } catch (err) {
            error.value = 'Error al obtener las consultas';
        } finally {
            loading.value = false;
        }
    };

    const fetchConsultaById = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await consultaService.getById(id);
            consulta.value = response.data;
        } catch (err) {
            error.value = 'Consulta no encontrada';
        } finally {
            loading.value = false;
        }
    };

    const createConsulta = async (consultaDto: ConsultaPostDto) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await consultaService.create(consultaDto);
            consultas.value.push(response.data);
        } catch (err) {
            error.value = 'Error al crear la consulta';
        } finally {
            loading.value = false;
        }
    };

    const updateConsulta = async (id: number, consultaDto: ConsultaUpdateDto) => {
        loading.value = true;
        error.value = null;
        try {
            await consultaService.update(id, consultaDto);
            await fetchAllConsultas();
        } catch (err) {
            error.value = 'Error al actualizar la consulta';
        } finally {
            loading.value = false;
        }
    };

    const deleteConsulta = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            await consultaService.delete(id);
            consultas.value = consultas.value.filter(c => c.id !== id);
        } catch (err) {
            error.value = 'Error al eliminar la consulta';
        } finally {
            loading.value = false;
        }
    };

    return {
        consultas,
        consulta,
        loading,
        error,
        fetchAllConsultas,
        fetchConsultaById,
        createConsulta,
        updateConsulta,
        deleteConsulta,
    };
});
