# Repositorio del front-end del Equipo 1

## Estructura de Carpetas

El directorio principal del código fuente es `src/`, el cual está organizado en las siguientes carpetas:

```
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
├── composables/
├── interfaces/
├── router/
├── stores/
├── utils/
├── views/
```

### Descripción de cada carpeta

- **assets/**: Contiene recursos estáticos como imágenes, fuentes y hojas de estilo globales.
- **components/**: Agrupa los componentes reutilizables del proyecto.
  - `common/`: Contiene componentes pequeños y reutilizables en toda la aplicación (ej. botones, modales, inputs).
  - `layout/`: Contiene componentes relacionados con la estructura de la aplicación. Puede contener sub-carpetas.
- **composables/**: Incluye funciones reutilizables usando la Composition API de Vue.
- **interfaces/**: Define tipos e interfaces TypeScript para estructurar datos de la aplicación.
- **router/**: Contiene la configuración de las rutas de Vue Router.
- **stores/**: Almacena los estados globales de la aplicación, utilizando Pinia.
- **utils/**: Contiene funciones auxiliares y utilitarias usadas en múltiples partes del código.
- **views/**: Agrupa las vistas principales de la aplicación, cada una representando una página o sección.

## Instalación

1. Clonar el repositorio:

   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. Instalar dependencias:

   ```sh
   npm install
   ```

3. Ejecutar la aplicación en modo desarrollo:
   ```sh
   npm run dev
   ```
