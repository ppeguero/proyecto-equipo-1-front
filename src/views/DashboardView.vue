<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Header -->
    <header class="bg-teal-300 p-4 text-center text-white font-bold text-2xl">
      Dashboard Veterinaria "El Cachorro Loco"
    </header>

    <div class="flex flex-col md:flex-row">
      <aside class="bg-blue-200 p-4 w-full md:w-1/4">
        <nav>
          <ul class="space-y-2">
            <li>
              <a href="#"
                 class="block bg-teal-200 text-white p-2 rounded hover:bg-teal-300">
                Inicio
              </a>
            </li>
            <li>
              <a href="#"
                 class="block bg-teal-200 text-white p-2 rounded hover:bg-teal-300">
                Pacientes
              </a>
            </li>
            <li>
              <a href="#"
                 class="block bg-teal-200 text-white p-2 rounded hover:bg-teal-300">
                Citas
              </a>
            </li>
            <li>
              <a href="#"
                 class="block bg-teal-200 text-white p-2 rounded hover:bg-teal-300">
                Inventario
              </a>
            </li>
            <li>
              <a href="#"
                 class="block bg-teal-200 text-white p-2 rounded hover:bg-teal-300">
                Reportes
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="p-4 flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-200 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-2">Total Pacientes</h2>
            <p class="text-3xl">42</p>
          </div>
          <div class="bg-blue-200 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-2">Citas de Hoy</h2>
            <p class="text-3xl">8</p>
          </div>
          <div class="bg-teal-200 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-2">Inventario</h2>
            <p class="text-3xl">150 Items</p>
          </div>
          <div class="bg-cyan-200 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-2">Reportes</h2>
            <p class="text-3xl">5 Nuevos</p>
          </div>
        </div>
        <div class="mt-4">
          <h2 class="text-2xl font-bold">Actividades Recientes</h2>
          <ul class="mt-2 space-y-1">
            <li class="bg-white p-2 rounded shadow">
              Paciente "Firulais" atendido por Dr. Pérez.
            </li>
            <li class="bg-white p-2 rounded shadow">
              Cita agendada para "Misu" a las 3:00 PM.
            </li>
            <li class="bg-white p-2 rounded shadow">
              Inventario actualizado: Se agregaron nuevos medicamentos.
            </li>
          </ul>
        </div>
      </main>
    </div>

    <footer class="bg-teal-300 p-4 text-center text-white">
      Dashboard Veterinaria "El Cachorro Loco" - Todos los derechos reservados.
    </footer>
  </div>
</template>
