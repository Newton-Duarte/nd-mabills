<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-toolbar :color="selectedType" dark>
        <v-toolbar-title>Categorias</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-flex xs1>
          <v-select
            v-model="typeSelected"
            :items="types"
            class="pt-2"
            hide-detail
            box
          ></v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn fab icon small color="grey" class="mb-2" v-on="on">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-form v-model="valid" lazy-validation ref="form">
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field 
                        v-model="category.description" 
                        :rules="generalRules"
                        prepend-icon="folder" 
                        required
                        label="Descrição"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-combobox
                        v-model="category.color"
                        :items="colors"
                        prepend-icon="edit"
                        label="Cor"
                      >
                      <template slot="selection" slot-scope="data">
                        <v-avatar size="24" :class="data.item"></v-avatar>
                      </template>
                      <template slot="item" slot-scope="data">
                        <template>
                          <v-avatar size="24" :class="data.item"></v-avatar>
                        </template>
                      </template>
                      </v-combobox>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="categories"
        class="elevation-1"
        item-key="id"
        no-data-text="Nenhum registro encontrado"
        :pagination.sync="pagination"
        rows-per-page-text="Registros"
      >
        <template v-slot:items="props">
          <!-- <tr :active="props.selected" @click="props.selected = !props.selected"> -->
          <tr>
            <!-- <td>
              <v-checkbox
                :input-value="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td> -->
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left success--text">
              <v-avatar size="24" :class="props.item.color"></v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.type }}</td>
            <td class="text-xs-left">{{ props.item.icon }}</td>
            <td class="justify-end layout pr-3">
              <v-btn @click="editItem(props.item)" fab flat icon small class="mx-0">
                <v-icon small flat>edit</v-icon>
              </v-btn>
              <v-btn @click="deleteItem(props.item)" fab flat icon small class="mx-0">
                <v-icon small flat>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:pageText="props">
          {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Category from '@/domain/category/Category';

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      category: new Category(),
      typeSelected: 'Receitas',
      types: ['Receitas', 'Despesas'],
      colors: ['primary', 'success darken-2', 'warning', 'info', 'error darken-2'],
      icons: [],
      generalRules: [
        v => !!v || 'Campo obrigatório'
      ],
      headers: [        
        {
          text: 'Descrição',
          align: 'left',
          value: 'description'
        },
        { text: 'Cor', value: 'color' },
        { text: 'Tipo', value: 'type' },
        { text: 'Ícone', value: 'icon' },
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10, // -1 for All"
        sortBy: 'type'
      },
      editedIndex: -1
    }
  },
  methods: {
    ...mapActions([
      'fetchCategories',
      'addCategory',
      'updateCategory',
      'deleteCategory'
    ]),
    editItem (item) {
      this.editedIndex = this.categories.indexOf(item)
      this.category = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem (item) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.deleteCategory(item.id);
      }
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.category = Object.assign({}, new Category());
        this.editedIndex = -1
      }, 300);
    },

    async save () {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          this.updateCategory(this.category);
        } else {
          this.category.type = this.typeSelected;
          this.addCategory(this.category);
        }
        this.close();
      } else {
        console.log(`Não foi possível salvar, por favor preencha todos os campos.`);
      }
    }
  },
  computed: {
    ...mapGetters([
      'categories'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'Nova Categoria' : 'Editar Categoria'
    },
    selectedType() {
      if (this.typeSelected == 'Receitas') return 'success darken-2'
      if (this.typeSelected == 'Despesas') return 'error darken-2'
    }
  },
  created() {
    this.fetchCategories();
  }
}
</script>

<style>

</style>
