import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import Vuelidate from 'vuelidate'
import router from "./router";
import { initializeApp } from "firebase/app";
import "firebase/database";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.min.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.config.productionTip = false;
Vue.use(Vuelidate)


const firebaseConfig = {
  apiKey: "AIzaSyBGuq4d2PPghceIuNq6sL8AROAFZgDjia0",
  authDomain: "fa-web-ex.firebaseapp.com",
  projectId: "fa-web-ex",
  storageBucket: "fa-web-ex.appspot.com",
  messagingSenderId: "1077988188120",
  appId: "1:1077988188120:web:adc10b510c3348d0915cad"
};
// Initialize Firebase
initializeApp(firebaseConfig);

let app;

const auth = getAuth();

onAuthStateChanged(auth, () => {
 if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
