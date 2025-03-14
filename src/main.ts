import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css';

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Material from '@primeuix/themes/material'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: 'none'
    }
  }
})

app.mount('#app')
