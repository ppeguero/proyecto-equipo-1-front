import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutComponent from '../components/layout/LayoutComponent.vue'
import DashboardView from '../views/DashboardView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import RolesView from '../views/RolesView.vue'
import CitasView from '../views/CitasView.vue'
import MascotasView from '../views/MascotasView.vue'
import ClientesView from '../views/ClientesView.vue'
import MedicamentosView from '../views/MedicamentosView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/dashboard",
      component: LayoutComponent,
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView
        },
        {
          path: "usuarios",
          name: "usuarios",
          component: UsuariosView
        },
        {
          path: "roles",
          name: "roles",
          component: RolesView
        },
        {
          path: "citas",
          name: "citas",
          component: CitasView
        },
        {
          path: "mascotas",
          name: "mascotas",
          component: MascotasView
        },
        {
          path: "clientes",
          name: "clientes",
          component: ClientesView
        },
        {
          path: "medicamentos",
          name: "medicamentos",
          component: MedicamentosView
        }
      ]
    }
  ],
})

export default router
