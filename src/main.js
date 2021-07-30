import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
/* import store from './store/store.js' */

import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Login from './components/Login.vue';
import pasajeroSolicitarViaje from './components/pasajeroSolicitarViaje.vue';
import pasajeroViaje from './components/pasajeroViaje.vue';
import conductorBuscarPasajero from './components/conductorBuscarPasajero.vue';
import pasajeroViajeFinalizado from './components/pasajeroViajeFinalizado.vue';
import pasajeroViajeCancelado from './components/pasajeroViajeCancelado.vue';
import conductorViajeCancelado from './components/conductorViajeCancelado.vue';
import conductorViajeFinalizado from './components/conductorViajeFinalizado.vue';
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL='http://localhost:5000/api/'
//axios.defaults.baseURL='https://gigat-backend-base.herokuapp.com/api/'



Vue.use(VueRouter)
/* Vue.use(Vuex) */
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {path: '/pasajerosolicitarviaje', component: pasajeroSolicitarViaje},
  { path: '/buscarconductor', component: pasajeroViaje},
  { path: '/buscarpasajero', component: conductorBuscarPasajero},
  { path: '/pasajero/viajefinalizado', component: pasajeroViajeFinalizado},
  { path: '/pasajero/viajecancelado', component: pasajeroViajeCancelado},
  { path: '/conductor/viajecancelado', component: conductorViajeCancelado},
  { path: '/conductor/viajefinalizado', component: conductorViajeFinalizado},
]
const router = new VueRouter({
  mode:'history',
  routes // short for `routes: routes`
});
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    token: null,
    theUser: null,
    idHistorial: null

  },
  mutations: {
    setToken(state,token){
      state.token=token;
    },
    setUsuario(state,theUser){
      state.theUser=theUser;
    },
    setIdHistorial(state, idHistorial){
      state.idHistorial=idHistorial;
    }
  },

  actions: {
    guardarToken({commit}, data){
      console.log("data")
      console.log(data.token)
      commit("setToken", data.token)
      commit("setUsuario", data.theUser)
      localStorage.setItem("token", data.token)
    },
    autoLogin({commit}){
      let token = localStorage.getItem("token");
      if(token) {
        commit("setToken", token);
        //commit("setUsuario", decode(token));
      }
      router.push("/");
    },
    salir({commit}){
      commit("setToken", null);
      commit("setUsuario", null);
      localStorage.removeItem("token");
      router.push("/login");
    },
    guardarIdHistorial({commit},data){
      commit("setIdHistorial", data);
    }
  },
  modules: {
  }
});
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

