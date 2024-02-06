// Import Vue and the root component
import { createApp } from 'vue';
import App from './App.vue';

// Importing Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// Importing Animation on Scroll
import AOS from 'aos'
import 'aos/dist/aos.css'
AOS.init();

// Create a Vue application instance
const app = createApp(App);

// Accordion Template global registration
import AccordionItem from './templates/AccordionItem.vue';
app.component('accordion-item', AccordionItem);

// Mount the application to the DOM
app.mount('#app');
