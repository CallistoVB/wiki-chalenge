import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import styles from './styles/styles.scss'

createApp(App).use(store).use(router).use(styles).mount('#app')
