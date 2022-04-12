import Vue from "vue";
import Vuex from "vuex";
import { createStore } from "vuex";

Vue.use(Vuex);

// create state that holds data
const state = {
  //testing
  currentUser: "Ryan Dhungel"
};

//update state data through mutations
const mutations = {};

//create actions for mutations with necessary data
const actions = {};

//get data from state
const getters = {
  currentUser: state => state.currentUser
};

//create vuex store
export default createStore({
  state() {
    return {
      count: 0
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
