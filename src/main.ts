import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElemenPlus from 'element-plus'

import 'element-plus/dist/index.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElemenPlus)
app.mount('#app')
