import { computed, onMounted, ref } from "vue";
import { useClienteStore } from "../stores/clienteStore";
import { useMascotaStore } from "../stores/mascotaStore";
import { useMedicamentoStore } from "../stores/medicamentoStore";
import { useConsultaStore } from "../stores/useConsultaStore";
import type { ChartData, SummaryData } from "../interfaces/Dashboard";

export function useDashboardData() {
  const consultaStore = useConsultaStore();
  const mascotaStore = useMascotaStore();
  const medicamentoStore = useMedicamentoStore();
  const clienteStore = useClienteStore();

  const summary = ref<SummaryData>({
    totalAppointments: 0,
    totalPets: 0,
    totalClients: 0,
    totalMedicines: 0,
  });

  const appointmentChartData = ref<ChartData | null>(null);
  const petSpeciesChartData = ref<ChartData | null>(null);

  const loadData = async () => {
    await Promise.all([
      consultaStore.fetchAllConsultas(),
      mascotaStore.fetchMascotas(),
      medicamentoStore.fetchMedicamentos(),
      clienteStore.fetchClientes(),
    ]);

    summary.value = {
      totalAppointments: consultaStore.consultas.length,
      totalPets: mascotaStore.mascotas.length,
      totalClients: clienteStore.clientes.length,
      totalMedicines: medicamentoStore.medicamentos.length,
    };

    const dates = consultaStore.consultas.map((x) => new Date(x.fecha).toLocaleDateString());
    const appointmentCounts = dates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    appointmentChartData.value = {
      labels: Object.keys(appointmentCounts),
      datasets: [
        {
          label: 'Citas por día',
          data: Object.values(appointmentCounts),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const species = mascotaStore.mascotas.map((m) => m.especie);
    const speciesCounts = species.reduce((acc, especie) => {
      acc[especie] = (acc[especie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    petSpeciesChartData.value = {
      labels: Object.keys(speciesCounts),
      datasets: [
        {
          data: Object.values(speciesCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };
  };

  const upcomingAppointments = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = consultaStore.consultas
      .filter((c) => {
        let citaDate: Date;
        if (c.fecha.includes('/')) {
          const [day, month, year] = c.fecha.split('/').map(Number);
          citaDate = new Date(year, month - 1, day);
        } else {
          citaDate = new Date(c.fecha);
        }
        return citaDate >= today;
      })
      .sort((a, b) => {
        let dateA: Date, dateB: Date;
        if (a.fecha.includes('/')) {
          const [dayA, monthA, yearA] = a.fecha.split('/').map(Number);
          dateA = new Date(yearA, monthA - 1, dayA);
        } else {
          dateA = new Date(a.fecha);
        }
        if (b.fecha.includes('/')) {
          const [dayB, monthB, yearB] = b.fecha.split('/').map(Number);
          dateB = new Date(yearB, monthB - 1, dayB);
        } else {
          dateB = new Date(b.fecha);
        }
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
    return filtered;
  });

  const lowStockMedicines = computed(() => {
    return medicamentoStore.medicamentos.filter((m) => m.stock < 5);
  });

  onMounted(() => loadData());

  console.log('summary', summary);

  return {
    summary,
    appointmentChartData,
    petSpeciesChartData,
    upcomingAppointments,
    lowStockMedicines,
  };
}
