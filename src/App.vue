<template>
  <v-app>
    <v-app-bar class="top-bar" fixed color="white" dense elevate-on-scroll>
      <v-toolbar-title color="cyan">
        <v-row>
         <v-col v-if="$route.name !== 'Home'">
           <v-btn icon to="/home">
             <v-icon dark>
               mdi-arrow-u-left-top
             </v-icon>
           </v-btn>
          </v-col>  
          <v-col>
            <v-icon large color="cyan">
              {{ retornarIcone() }}
            </v-icon>
            <span class="title-app-bar">
              {{ $route.name }}
            </span>
          </v-col>
          <v-col>

          </v-col>
        </v-row>
        
      </v-toolbar-title>
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