import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import LoadScript from 'vue-plugin-load-script'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faCamera, faFileUpload, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add([faUpload, faCamera, faFileUpload, faFileDownload])

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(LoadScript)

app.mount('#app')
