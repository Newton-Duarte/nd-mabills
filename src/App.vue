<template>
  <v-app>
    <Navbar />

    <v-content class="indigo lighten-2">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/navbar/Navbar'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
