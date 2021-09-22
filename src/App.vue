<template>
  <v-app>
    <v-app-bar class="top-bar" fixed color="white" dense elevate-on-scroll v-if="$route.name !== 'Login'">
        
        <v-row justify="center" align="center">
         <v-col v-if="$route.name !== 'Home'" cols="2">
           <v-btn icon to="/home">
             <v-icon dark>
               mdi-arrow-u-left-top
             </v-icon>
           </v-btn>
          </v-col>  
          <v-col cols="6">
            <v-icon large color="cyan">
              {{ retornarIcone() }}
            </v-icon>
            <span class="title-app-bar">
              {{ $route.name }}
            </span>
          </v-col>
          <v-col v-if="$route.name !== 'Home'" cols="4">
            <v-btn dark color="teal" @click="novoItem()">
              <v-icon dark left>
                mdi-plus
              </v-icon>Novo {{ $route.name }}
            </v-btn>
          </v-col>
        </v-row>
    </v-app-bar>
    <v-container>
      <router-view />
    </v-container>
  </v-app>
</template>
<script>
import items from './shared/items'

export default {
  name: 'App',
  data: () => ({
    drawer: false,
    group: null,
    value: null,
    items: items
  }),
  methods: {
    novoItem() {
      this.$root.$refs.Children.adicionarItem()
    },
    retornarIcone () {
      var item = items.find(item => item.title === this.$route.name)
      return !item ? 'mdi-home' : item.icon
    }
  }
};
</script>

<style>
.title-app-bar{
  color: #00BCD4;
}
.v-toolbar__content {
  border-bottom: #EB7A13 solid 2px;
}
</style>