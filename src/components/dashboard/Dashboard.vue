<template>
  <v-flex xs12>
    <v-layout row wrap :justify-center="$vuetify.breakpoint.mdAndUp">
      <v-flex xs12 md2>
        <v-card>
          <v-card-title>
            <v-avatar color="primary mr-3">
              <v-icon dark>account_balance</v-icon>
            </v-avatar>
            <div class="subheading">Saldo Atual</div>
          </v-card-title>
            <h6 class="headline text-xs-right primary--text font-weight-bold pr-3">R$ {{ currentBalance | total }}</h6>
        </v-card>
      </v-flex>
      <v-flex xs12 md2 :mx-3="$vuetify.breakpoint.mdAndUp" :my-3="$vuetify.breakpoint.smAndDown">
        <v-card>
          <v-card-title>
            <v-avatar color="success darken-2 mr-3">
              <v-icon dark>trending_up</v-icon>
            </v-avatar>
            <div class="subheading">Receitas</div>
          </v-card-title>
            <h6 class="headline text-xs-right success--text text--darken-2 font-weight-bold pr-3">R$ {{ totalAmountIncomes | total }}</h6>
        </v-card>
      </v-flex>
      <v-flex xs12 md2>
        <v-card>
          <v-card-title>
            <v-avatar color="error darken-2 mr-3">
              <v-icon dark>trending_down</v-icon>
            </v-avatar>
            <div class="subheading">Despesas</div>
          </v-card-title>
            <h6 class="headline text-xs-right error--text text--darken-2 font-weight-bold pr-3">R$ {{ totalAmountExpenses | total }}</h6>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- TODO: Mostrar como gráfico pizza -->
    <v-layout row wrap mt-3 :justify-center="$vuetify.breakpoint.mdAndUp">
      <v-flex xs12 md3 :mr-4="$vuetify.breakpoint.mdAndUp" :mb-3="$vuetify.breakpoint.smAndDown">
        <v-card height="180px">
          <v-card-title>
            <v-flex xs12>
              <v-layout row align-center mb-3>
                <h5 class="title">Receitas Mensais</h5>
                <v-spacer></v-spacer>
                <v-btn flat small color="primary">Ver Mais</v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout v-for="category in incomeCategories" :key="category.id" row mb-1>
                <span>{{ category.description }}</span>
                <v-spacer></v-spacer>
                <span class="pr-4 font-weight-medium">R$ {{ incomesByCategory(category.description) | total }}</span>
              </v-layout>
              <v-divider class="my-1"></v-divider>
              <v-layout row>
                <span class="subheading font-weight-bold success--text text--darken-2">Total</span>
                <v-spacer></v-spacer>
                <span class="subheading pr-4 font-weight-bold success--text text--darken-2">R$ {{ totalAmountIncomes | total }}</span>
              </v-layout>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md3>
        <v-card height="180px">
          <v-card-title>
            <v-flex xs12>
              <v-layout row align-center mb-3>
                <h5 class="title">Despesas Mensais</h5>
                <v-spacer></v-spacer>
                <v-btn flat small color="primary">Ver Mais</v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout v-for="category in expenseCategories" :key="category.id" row mb-1>
                <span>{{ category.description }}</span>
                <v-spacer></v-spacer>
                <span class="pr-4 font-weight-medium">R$ {{ expensesByCategory(category.description) | total }}</span>
              </v-layout>
              <v-divider class="my-1"></v-divider>
              <v-layout row>
                <span class="subheading font-weight-bold error--text text--darken-2">Total</span>
                <v-spacer></v-spacer>
                <span class="subheading pr-4 font-weight-bold error--text text--darken-2">R$ {{ totalAmountExpenses | total }}</span>
              </v-layout>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions([
      'fetchIncomes',
      'fetchExpenses',
      'fetchAccounts',
      'fetchCategories'
    ])
  },
  computed: {
    ...mapGetters([
      'currentBalance',
      'totalAmountIncomes',
      'totalAmountExpenses',
      'incomeCategories',
      'expenseCategories',
      'incomesByCategory',
      'expensesByCategory'
    ])
  },
  filters: {
    total: value => typeof value == 'number' ? value.toFixed(2) : 'aguarde...'
  },
  mounted() {
    this.fetchIncomes();
    this.fetchExpenses();
    this.fetchAccounts();
    this.fetchCategories();
  },
}
</script>

<style>

</style>
