import { db } from '@/firebase/init';

const collection = 'expenses';

const state = {
  expenses: []
};

const getters = {
  expenses: state => state.expenses,
  totalAmountExpenses: state => {
    return state.expenses.reduce((total,item) => {
      return total + item.amount;
    }, 0);
  },
  pendingAmountExpenses: state => {
    return state.expenses.reduce((total,item) => {
      return !item.paid? total + item.amount : total;
    }, 0);
  },
  paidAmountExpenses: state => {
    return state.expenses.reduce((total,item) => {
      return item.paid? total + item.amount : total;
    }, 0);
  },
  expensesByCategory: state => category => {
    return state.expenses.reduce((total,item) => {
      return item.category.description === category ? total + item.amount : total;
    }, 0);
  }
};

const actions = {
  async fetchExpenses({ commit }) {
    const data = [];
    await db.collection(collection).onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === 'added') {
          data.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
    commit('setExpenses', data);
  },
  async addExpense({ commit }, expense) {
    db.collection(collection)
      .add({...expense});
  },
  async payExpense({ dispatch }, expense) {
    expense.paid = true;
    dispatch('updateExpense', expense);
  },
  async updateExpense({ commit }, updExpense) {
    await db.collection(collection)
            .doc(updExpense.id)
            .update(updExpense);
    commit('updateExpense', updExpense);
  },
  async deleteExpense({ commit }, id) {
    await db.collection(collection)
            .doc(id)
            .delete();
    commit('removeExpense', id);
  }
};

const mutations = {
  setExpenses: (state, expenses) => state.expenses = expenses,
  removeExpense: (state, id) => state.expenses = state.expenses.filter(expense => expense.id !== id),
  updateExpense: (state, updExpense) => {
    const index = state.expenses.findIndex(expense => expense.id === updExpense.id);
    if (index !== -1) {
      state.expenses.splice(index, 1, updExpense);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}