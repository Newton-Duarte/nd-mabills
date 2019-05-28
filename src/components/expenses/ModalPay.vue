<template>
  <v-dialog v-model="dialog" max-width="600px">
    <slot slot="activator"></slot>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-alert
        :value="true"
        type="error"
        color="error darken-2"
        class="mx-3"
      >
        O valor desta parcela será retirado da sua conta.
      </v-alert>

      <v-card-text>
        <v-container grid-list-md>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field 
                  type="number"
                  step="0.01"
                  v-model="mExpense.amount" 
                  :rules="amountRules"
                  prepend-icon="money" 
                  label="Valor"
                  required
                  validate-on-blur
                  autofocus
                  prefix="R$"></v-text-field>
              </v-flex>
              <v-flex xs12>
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
                  <v-date-picker v-model="mExpense.date" @input="datepicker = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  v-model="mExpense.account"
                  :rules="generalRules"
                  prepend-icon="label_important"
                  :items="accounts"
                  item-text="description"
                  item-value="description"
                  required
                  label="Conta"
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
        <v-btn color="blue darken-1" flat @click="pay">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ModalPay',
  props: ['expense'],
  data() {
    return {
      mExpense: Object.assign({}, this.expense),
      dialog: false,
      formTitle: 'Pagar Parcela',
      valid: false,
      datepicker: false,
      amountRules: [
        v => !!v || 'Informe o Valor'
      ],
      generalRules: [
        v => !!v || 'Campo obrigatório'
      ],
    }
  },
  computed: {
    ...mapGetters([
      'accounts'
    ]),
    formattedDate() {
      if (this.mExpense)
        return this.mExpense.date.split('-').reverse().join('/');
      },
  },
  methods: {
    close() {
      this.dialog = false;
    },
    pay() {
      this.mExpense.amount = this.mExpense.amount.toString();
      this.mExpense.amount = this.mExpense.amount.replace(/,/g, '.');
      this.mExpense.amount = this.mExpense.amount.replace(/[^0-9,.]+/g, '');
      this.mExpense.amount = parseFloat(this.mExpense.amount);
      this.$emit('pay', this.mExpense);
    }
  }
}
</script>

<style>

</style>
