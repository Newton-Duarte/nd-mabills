import { db } from '@/firebase/init';

const collection = 'incomes';

const state = {
  incomes: []
};

const getters = {
  incomes: state => state.incomes,
  totalAmountIncomes: state => {
    return state.incomes.reduce((total,item) => {
      return total + item.amount;
    }, 0);
  },
  pendingAmountIncomes: state => {
    return state.incomes.reduce((total,item) => {
      return !item.received? total + item.amount : total;
    }, 0);
  },
  receivedAmountIncomes: state => {
    return state.incomes.reduce((total,item) => {
      return item.received? total + item.amount : total;
    }, 0);
  },
  incomesByCategory: state => category => {
    return state.incomes.reduce((total,item) => {
      return item.category.description === category ? total + item.amount : total;
    }, 0);
  }
};

const actions = {
  async fetchIncomes({ commit }) {
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
    commit('setIncomes', data);
  },
  async addIncome({ commit }, income) {
    db.collection(collection)
      .add({...income});
  },
  async receiveIncome({ dispatch }, income) {
    income.received = true;
    dispatch('updateIncome', income);
  },
  async updateIncome({ commit }, updIncome) {
    await db.collection(collection)
            .doc(updIncome.id)
            .update(updIncome);
    commit('updateIncome', updIncome);
  },
  async deleteIncome({ commit }, id) {
    await db.collection(collection)
            .doc(id)
            .delete();
    commit('removeIncome', id);
  }
};

const mutations = {
  setIncomes: (state, incomes) => state.incomes = incomes,
  removeIncome: (state, id) => state.incomes = state.incomes.filter(income => income.id !== id),
  updateIncome: (state, updIncome) => {
    const index = state.incomes.findIndex(income => income.id === updIncome.id);
    if (index !== -1) {
      state.incomes.splice(index, 1, updIncome);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}