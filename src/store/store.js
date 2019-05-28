import Vue from 'vue'
import Vuex from 'vuex'
import incomes from './modules/incomes'
import expenses from './modules/expenses'
import accounts from './modules/accounts'
import categories from './modules/categories'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    incomes,
    expenses,
    accounts,
    categories
  }
})
