<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-bottom-navigation v-model="value">
      <v-btn value="recent" to="/produtos">
        <span>Produtos</span>
        <v-icon>mdi-toy-brick</v-icon>
      </v-btn>
      <v-btn value="favorites" to="/clientes">
        <span>Clientes</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn value="nearby" to="/">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-bottom-navigation>
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