import { ref, onMounted } from 'vue';
import { useUsuarioStore } from '@/stores/usuario';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { jwtDecode } from 'jwt-decode';
import { profileSchema } from '@/schemas/profileSchema';

export function useProfileForm() {
  const usuarioStore = useUsuarioStore();
  const router = useRouter();
  const toast = useToast();

  const usuario = ref({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
  });
  const password = ref('');
  const confirmPassword = ref('');
  const errors = ref<Partial<Record<string, string>>>({});
  const isLoaded = ref(false);

  const validateForm = async (): Promise<boolean> => {
    try {
      const validationData = { ...usuario.value };
      if (password.value && password.value.trim() !== '') {
        validationData.password = password.value;
        validationData.confirmPassword = confirmPassword.value;
      }
      await profileSchema.validate(validationData, { abortEarly: false });
      errors.value = {};
      return true;
    } catch (err) {
      if (err instanceof Error && 'inner' in err) {
        const newErrors: Partial<Record<string, string>> = {};
        (err as any).inner.forEach((error: any) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        errors.value = newErrors;
        return false;
      }
      return false;
    }
  };

  const submitForm = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, corrige los errores en el formulario.', life: 3000 });
      return;
    }

    try {
      await usuarioStore.updateUsuario(usuario.value);
      if (password.value && password.value.trim() !== '') {
        await usuarioStore.updatePassword(usuario.value.id, password.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil y contraseña actualizados correctamente.', life: 3000 });
      } else {
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente.', life: 3000 });
      }
      router.push('/dashboard');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al actualizar el perfil.', life: 3000 });
    }
  };

  onMounted(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró un token de autenticación.', life: 3000 });
        router.push('/login');
        return;
      }

      const decoded: any = jwtDecode(token);
      const userId = decoded.nameid;

      if (!userId) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el ID del usuario en el token.', life: 3000 });
        router.push('/login');
        return;
      }

      const userData = await usuarioStore.getUsuarioById(parseInt(userId));
      if (userData) {
        usuario.value = { ...userData };
        isLoaded.value = true;
      } else {
        throw new Error('Datos del usuario no válidos');
      }
    } catch (error) {
      console.error('Error en onMounted:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el perfil.', life: 3000 });
      router.push('/login');
    }
  });

  return {
    usuario,
    password,
    confirmPassword,
    errors,
    isLoaded,
    submitForm,
  };
}
