// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import firebase from "firebase/compat/app";
import store from "./store";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";

Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYtkSDhOymgXQu8kc42m1Q3MJb11vinLw",
  authDomain: "vuexslack-c78f7.firebaseapp.com",
  projectId: "vuexslack-c78f7",
  storageBucket: "vuexslack-c78f7.appspot.com",
  messagingSenderId: "255023429674",
  appId: "1:255023429674:web:a91a8a5496ca6ce60e2b53"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  //store,
  components: { App },
  template: "<App/>"
});
