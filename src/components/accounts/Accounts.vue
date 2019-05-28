<template>
  <v-layout row wrap>
    <v-flex xs12 lg10 :order-xs2="$vuetify.breakpoint.mdAndDown">
      <v-toolbar color="white">
        <v-toolbar-title>Contas</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nova Conta</v-btn>
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
                        v-model="account.description" 
                        :rules="generalRules"
                        prepend-icon="folder" 
                        required
                        label="Descrição"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field 
                        v-model="account.balance" 
                        :rules="generalRules"
                        prepend-icon="money" 
                        prefix="R$ "
                        required
                        :disabled="editedIndex > -1"
                        label="Saldo"></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-select 
                        v-model="account.type"
                        :items="types"
                        :rules="generalRules"
                        prepend-icon="folder" 
                        required
                        label="Tipo de Conta"></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-combobox
                        v-model="account.color"
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
        :items="accounts"
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
            <td class="text-xs-left">R$ {{ props.item.balance | total }}</td>
            <td class="text-xs-left">{{ props.item.type }}</td>
            <td class="text-xs-left success--text">
              <v-avatar size="24" :class="props.item.color"></v-avatar>
            </td>
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
    <v-flex xs12 lg2 :order-xs1="$vuetify.breakpoint.mdAndDown" :class="{ 'pl-2': $vuetify.breakpoint.lgAndUp }">
      <v-card class="mb-3">
        <v-card-title>
          <v-avatar color="primary mr-3">
            <v-icon dark>done</v-icon>
          </v-avatar>
          <div class="subheading">Saldo Atual</div>
        </v-card-title>
          <h6 class="headline text-xs-right pr-3">R$ {{ currentBalance | total }}</h6>
      </v-card>
      <v-card class="mb-3">
        <v-card-title>
          <v-avatar color="primary mr-3">
            <v-icon dark>done_all</v-icon>
          </v-avatar>
          <div class="subheading">Saldo Final do Mês</div>
        </v-card-title>
          <h6 class="headline text-xs-right pr-3">R$ {{ finalBalance | total }}</h6>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Account from '@/domain/account/Account';

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      account: new Account(),
      typeSelected: 'Conta Corrente',
      types: ['Dinheiro', 'Poupança', 'Conta Corrente', 'Investimentos', 'Outros'],
      colors: ['primary', 'success', 'warning', 'info', 'error'],
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
        { text: 'Saldo', value: 'balance' },
        { text: 'Tipo', value: 'type' },
        { text: 'Cor', value: 'color' },
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10, // -1 for All"
        sortBy: 'balance'
      },
      editedIndex: -1
    }
  },
  methods: {
    ...mapActions([
      'fetchAccounts',
      'addAccount',
      'updateAccount',
      'deleteAccount'
    ]),
    editItem (item) {
      this.editedIndex = this.accounts.indexOf(item)
      this.account = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem (item) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.deleteAccount(item.id);
      }
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.account = Object.assign({}, new Account());
        this.editedIndex = -1
      }, 300);
    },

    async save () {
      if (this.$refs.form.validate()) {
        this.account.balance = this.account.balance.toString();
        this.account.balance = this.account.balance.replace(/,/g, '.');
        this.account.balance = this.account.balance.replace(/[^0-9,.]+/g, '');
        this.account.balance = parseFloat(this.account.balance);
        if (this.editedIndex > -1) {
          this.updateAccount(this.account);
        } else {
          this.addAccount(this.account);
        }
        this.close();
      } else {
        console.log(`Não foi possível salvar, por favor preencha todos os campos.`);
      }
    }
  },
  filters: {
    total: value => typeof value == 'number' ? value.toFixed(2) : 'aguarde...'
  },
  computed: {
    ...mapGetters([
      'accounts',
      'currentBalance',
      'pendingAmountIncomes',
      'pendingAmountExpenses'
    ]),
    formTitle () {
      return this.editedIndex === -1 ? 'Nova Conta' : 'Editar Conta'
    },
    finalBalance() {
      return (this.currentBalance + this.pendingAmountIncomes) - this.pendingAmountExpenses;
    }
  },
  created() {
    this.fetchAccounts();
  }
}
</script>

<style>

</style>
