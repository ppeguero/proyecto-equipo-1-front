import { createRouter, createWebHistory } from 'vue-router';
import LayoutComponent from '../components/layout/LayoutComponent.vue';
import DashboardView from '../views/DashboardView.vue';
import UsuariosView from '../views/UsuariosView.vue';
import RolesView from '../views/RolesView.vue';
import CitasView from '../views/CitasView.vue';
import MascotasView from '../views/MascotasView.vue';
import ClientesView from '../views/ClientesView.vue';
import MedicamentosView from '../views/MedicamentosView.vue';
import { useStorage } from '@vueuse/core';
import { jwtDecode } from 'jwt-decode';
import LoginView from '../views/LoginView.vue';

const token = useStorage('token', '');
const isAuthenticated = () => !!token.value;

interface JwtPayload {
  role: string;
}

const getUserRole = (): string | null => {
  if (token.value) {
    try {
      const decoded = jwtDecode<JwtPayload>(token.value);
      return decoded.role;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }
  return null;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: LayoutComponent,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: UsuariosView,
          meta: { requiresRole: 'Administrador' },
        },
        {
          path: 'roles',
          name: 'roles',
          component: RolesView,
          meta: { requiresRole: 'Administrador' },
        },
        {
          path: 'citas',
          name: 'citas',
          component: CitasView,
        },
        {
          path: 'mascotas',
          name: 'mascotas',
          component: MascotasView,
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: ClientesView,
        },
        {
          path: 'medicamentos',
          name: 'medicamentos',
          component: MedicamentosView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'login' });
    } else {
      const requiredRole = to.meta.requiresRole as string | undefined;
      if (requiredRole) {
        const userRole = getUserRole();
        if (userRole !== requiredRole) {
          next({ name: 'dashboard' });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;

