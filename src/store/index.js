import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    cart: []
  },
  getters: {
    isStudent: (state) => {
      return state.user.role === 'STUDENT'
    },
    isTeacher: (state) => {
      return state.user.role === 'TEACHER'
    },
    isAdmin: (state) => {
      return state.user.id === 0
    }
  },
  mutations: {
    saveUser (state, user) {
      state.user = user
    },
    addProblem (state, problem) {
      state.cart.push(problem)
    },
    removeProblem (state, problem) {
      state.cart = state.cart.filter(item => item.id !== problem.id)
    },
    clearProblem (state) {
      state.cart = []
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
