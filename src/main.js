import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue' // importamos el plugin de formkit y su configuración por defecto
import config from '../formkit.config' // importamos la configuración de formkit

import App from './App.vue'
import router from './router'

// Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'

const app = createApp(App)

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
app.use(createPinia())
app.use(plugin, defaultConfig(config)) // usamos el plugin de formkit y le pasamos la configuración por defecto
app.use(router)

app.mount('#app')
