<template>
  <v-layout row wrap>
    <v-flex xs12 lg10 :order-xs2="$vuetify.breakpoint.mdAndDown">
      <v-toolbar color="white">
        <v-toolbar-title>Receitas</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn color="success darken-2" dark class="mb-2" v-on="on">Nova Receita</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-form v-model="valid" lazy-validation ref="form">
                  <v-layout wrap>
                    <v-flex xs12 sm6>
                      <v-text-field 
                        type="number"
                        step="0.01"
                        v-model="income.amount" 
                        :rules="amountRules"
                        prepend-icon="money" 
                        label="Valor"
                        required
                        validate-on-blur
                        autofocus
                        prefix="R$"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-menu
                        v-model="datepicker"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="formattedDate"
                            label="Data"
                            prepend-icon="event"
                            readonly
                            required
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="income.date" @input="datepicker = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm9>
                      <v-text-field 
                        v-model="income.description" 
                        :rules="generalRules"
                        prepend-icon="comment" 
                        required
                        label="Descrição"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-checkbox 
                        v-model="income.received" 
                        color="success darken-2" 
                        label="Recebido"></v-checkbox>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-combobox
                        v-model="income.category"
                        :rules="generalRules"
                        prepend-icon="label_important"
                        :items="incomeCategories"
                        item-text="description"
                        item-value="description"
                        required
                        label="Categoria"
                      ></v-combobox>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-combobox
                        v-model="income.account"
                        :rules="generalRules"
                        prepend-icon="label_important"
                        :items="accounts"
                        item-text="description"
                        item-value="description"
                        required
                        label="Conta"
                      ></v-combobox>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="income.note" prepend-icon="edit" label="Observações"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success darken-2" flat @click="close">Cancelar</v-btn>
              <v-btn color="success darken-2" @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="incomes"
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
            <td class="text-xs-left">
              <v-avatar size="18" :class="received(props.item.received)"></v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left">{{ formatDate(props.item.date) }}</td>
            <td class="text-xs-left success--text text--darken-2">R$ {{ props.item.amount | total }}</td>
            <td class="text-xs-left">
              <v-chip outline :text-color="props.item.category.color">
                <v-avatar>
                  <v-icon>label_important</v-icon>
                </v-avatar>
                {{ props.item.category.description }}
              </v-chip>
            </td>
            <td class="text-xs-left">{{ props.item.account.description }}</td>
            <td class="text-xs-left">{{ props.item.note }}</td>
            <td class="justify-end layout pr-3">
              <ModalReceive :income="props.item" v-if="!props.item.received" @receive="receiveItem">
                <v-btn fab flat icon small class="mx-0">
                  <v-icon small flat>done</v-icon>
                </v-btn>
              </ModalReceive>
              <!-- <v-btn v-if="!props.item.received" @click="receiveItem(props.item)" fab flat icon small class="mx-0">
                <v-icon small flat>done</v-icon>
              </v-btn> -->
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
            <v-avatar color="success darken-2 mr-3">
              <v-icon dark>flag</v-icon>
            </v-avatar>
            <div class="subheading">Receitas Pendentes</div>
          </v-card-title>
            <h6 class="headline text-xs-right pr-3">R$ {{ pendingAmountIncomes | total }}</h6>
        </v-card>
        <v-card class="mb-3">
          <v-card-title>
            <v-avatar color="success darken-2 mr-3">
              <v-icon dark>done</v-icon>
            </v-avatar>
            <div class="subheading">Receitas Recebidas</div>
          </v-card-title>
            <h6 class="headline text-xs-right pr-3">R$ {{ receivedAmountIncomes | total }}</h6>
        </v-card>
        <v-card class="mb-3">
          <v-card-title>
            <v-avatar color="success darken-2 mr-3">
              <v-icon dark>done_all</v-icon>
            </v-avatar>
            <div class="subheading">Total</div>
          </v-card-title>
            <h6 class="headline text-xs-right pr-3">R$ {{ totalAmountIncomes | total }}</h6>
        </v-card>
      </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Income from '@/domain/income/Income';
import ModalReceive from '@/components/incomes/ModalReceive';
import { db } from '@/firebase/init';

  export default {
    components: {
      ModalReceive
    },
    data: () => ({
      dialog: false,
      datepicker: false,
      valid: false,
      amountRules: [
        v => !!v || 'Informe o Valor',
        v => v > 0 || 'O valor não pode ser menor que 0'
      ],
      generalRules: [
        v => !!v || 'Campo obrigatório'
      ],
      headers: [
        { text: '', value: 'received', sortable: false },
        {
          text: 'Descrição',
          align: 'left',
          value: 'description'
        },
        { text: 'Data', value: 'date' },
        { text: 'Valor', value: 'amount' },
        { text: 'Categoria', value: 'category' },
        { text: 'Conta', value: 'account' },
        { text: 'Observações', value: 'note', sortable: false }
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 10, // -1 for All"
        sortBy: 'date'
      },
      editedIndex: -1,
      income: new Income(),
    }),

    created() {
      this.fetchIncomes();
      this.fetchCategories();
      this.fetchAccounts();
    },

    filters: {
      total: value => typeof value == 'number' ? value.toFixed(2) : 'aguarde...'
    },

    computed: {
      ...mapGetters([
          'incomes',
          'totalAmountIncomes' ,
          'pendingAmountIncomes',
          'receivedAmountIncomes',
          'incomeCategories', 
          'accounts'
        ]),
      formTitle () {
        return this.editedIndex === -1 ? 'Nova Receita' : 'Editar Receita'
      },
      formattedDate() {
        return this.income.date.split('-').reverse().join('/');
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    methods: {

      ...mapActions([
        'fetchIncomes', 
        'addIncome', 
        'updateIncome', 
        'deleteIncome', 
        'receiveIncome',
        'fetchCategories',
        'fetchAccounts',
        'deposit',
        'withdraw'
      ]),

      formatDate(date) {
        return date.split('-').reverse().join('/');
      },

      received(status) {
        return status ? 'success' : 'error';
      },

      editItem (item) {
        this.editedIndex = this.incomes.indexOf(item)
        this.income = Object.assign({}, item)
        this.dialog = true
      },

      async receiveItem (item) {
        await this.receiveIncome(item);
        await this.deposit({ account: item.account, amount: item.amount });
      },

      async deleteItem (item) {
        if (confirm('Are you sure you want to delete this item?')) {
          await this.deleteIncome(item.id);
          if (item.received) await this.withdraw({ account: item.account, amount: item.amount });
        }
      },

      close () {
        this.dialog = false;
        setTimeout(() => {
          this.income = Object.assign({}, new Income());
          this.editedIndex = -1
        }, 300);
      },

      async save () {
        if (this.$refs.form.validate()) {
          this.income.amount = this.income.amount.toString();
          this.income.amount = this.income.amount.replace(/,/g, '.');
          this.income.amount = this.income.amount.replace(/[^0-9,.]+/g, '');
          this.income.amount = parseFloat(this.income.amount);
          if (this.editedIndex > -1) {
            this.updateIncome(this.income);
          } else {
            this.addIncome(this.income);
          }
          this.close();
        } else {
          console.log(`Formato incorreto: ${this.income.amount} - ${typeof this.income.amount}`);
        }
      }
    }
  }
</script>

<style scoped>

</style>
