import * as Yup from 'yup';

export const profileSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  email: Yup.string().email('Debe ser un correo válido').required('El correo es requerido'),
  password: Yup.string()
    .notRequired()
    .test('len', 'La contraseña debe tener al menos 6 caracteres', (val) => !val || val.length >= 6),
  confirmPassword: Yup.string()
    .notRequired()
    .when('password', {
      is: (password: string) => !!password && password.trim() !== '',
      then: (schema) =>
        schema
          .required('Debe confirmar la contraseña')
          .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
      otherwise: (schema) => schema.notRequired(),
    }),
});
