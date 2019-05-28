import { db } from '@/firebase/init';

const collection = 'categories';

const state = {
  categories: []
};

const getters = {
  categories: state => state.categories,
  incomeCategories: state => state.categories.filter(category => category.type == 'Receitas'),
  expenseCategories: state => state.categories.filter(category => category.type == 'Despesas')
};

const actions = {
  async fetchCategories({ commit }) {
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
    commit('setCategories', data);
  },
  async addCategory({ commit }, category) {
    db.collection(collection)
      .add({...category});
  },
  async updateCategory({ commit }, updCategory) {
    await db.collection(collection)
            .doc(updCategory.id)
            .update(updCategory);
    commit('updateCategory', updCategory);
  },
  async deleteCategory({ commit }, id) {
    await db.collection(collection)
            .doc(id)
            .delete();
    commit('removeCategory', id);
  }
};

const mutations = {
  setCategories: (state, categories) => state.categories = categories,
  removeCategory: (state, id) => state.categories = state.categories.filter(category => category.id !== id),
  updateCategory: (state, updCategory) => {
    const index = state.categories.findIndex(category => category.id === updCategory.id);
    if (index !== -1) {
      state.categories.splice(index, 1, updCategory);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}