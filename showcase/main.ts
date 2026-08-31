import { createSSRApp } from 'vue';

import ShowcaseApp from './ShowcaseApp.vue';

import '../src/styles/index.css';

createSSRApp(ShowcaseApp).mount('#app');
