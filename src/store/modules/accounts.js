import { db } from '@/firebase/init';

const collection = 'accounts';

const state = {
  accounts: []
};

const getters = {
  accounts: state => state.accounts,
  account: (state, id) => state.accounts.find(account => account.id === id),
  currentBalance: state => {
    return state.accounts.reduce((total,item) => {
      return total + item.balance;
    }, 0);
  }
};

const actions = {
  async fetchAccounts({ commit }) {
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
    commit('setAccounts', data);
  },
  async addAccount({ commit }, account) {
    db.collection(collection)
      .add({...account});
  },
  async updateAccount({ commit }, updAccount) {
    await db.collection(collection)
            .doc(updAccount.id)
            .update(updAccount);
    commit('updateAccount', updAccount);
  },
  async deleteAccount({ commit }, id) {
    await db.collection(collection)
            .doc(id)
            .delete();
    commit('removeAccount', id);
  },
  async withdraw({ dispatch, state }, payload) {
    const account = state.accounts.find(account => account.id === payload.account.id);
    account.balance -= payload.amount;
    dispatch('updateAccount', account);
  },
  async deposit({ dispatch, state }, payload) {
    const account = state.accounts.find(account => account.id === payload.account.id);
    account.balance += payload.amount;
    dispatch('updateAccount', account);
  }
};

const mutations = {
  setAccounts: (state, accounts) => state.accounts = accounts,
  removeAccount: (state, id) => state.accounts = state.accounts.filter(income => income.id !== id),
  updateAccount: (state, updAccount) => {
    const index = state.accounts.findIndex(account => account.id === updAccount.id);
    if (index !== -1) {
      state.accounts.splice(index, 1, updAccount);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}