export interface SummaryData{
  totalAppointments: number;
  totalPets: number;
  totalClients: number;
  totalMedicines: number;
}
export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
