import Vue from "vue";
import Vuex from "vuex";
import auth from './auth'
// import firebase from 'firebase/app'

import { getAuth } from "firebase/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    getUid() {
      const auth = getAuth()
      const user = auth.currentUser
      return user ? user.uid : null
    },
    // async fetchInfo({ dispatch, commit }) {
    //   // const uid = await dispatch('getUid')
    //   // const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
    //   // commit('setInfo', info)
    // },
  },
  modules: {
    auth
  },
});
