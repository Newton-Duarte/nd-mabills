<template>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>Mabills</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat to="/">Dashboard</v-btn>
      <v-btn flat to="incomes">Receitas</v-btn>
      <v-btn flat to="expenses">Despesas</v-btn>
      <!-- <v-btn flat to="transfers">Transferências</v-btn> -->
      <v-btn flat to="accounts">Contas</v-btn>
      <v-btn flat to="categories">Categorias</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style>

</style>
