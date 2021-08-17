<template>
  <v-app>
    <div>
      <v-app-bar
      color="white"
      dense
      elevate-on-scroll
      >
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

    
        <v-toolbar-title color="cyan">
          <v-icon
            large
            color="cyan"
          >
            mdi-home
          </v-icon>
          <span class="title-app-bar">Home</span>
        </v-toolbar-title>
      </v-app-bar>
    </div>
    
    <v-main>
      <router-view />
    </v-main>
    

<!-- 
    <v-bottom-navigation v-model="value">
      <v-btn value="produtos" to="/produtos">
        <span>Produtos</span>
        <v-icon>mdi-toy-brick</v-icon>
      </v-btn>
      <v-btn value="clientes" to="/clientes">
        <span>Clientes</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn value="home" to="/">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-bottom-navigation> -->
  </v-app>
</template>
<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    group: null,
    value: null
  }),
};
</script>

<style>
.title-app-bar{
  color: #00BCD4;
}
</style>