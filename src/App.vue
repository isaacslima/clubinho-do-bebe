<template>
  <v-app>
    <v-app-bar fixed color="white" dense elevate-on-scroll>
      <v-toolbar-title color="cyan">
        <v-icon large color="cyan">
          mdi-home
        </v-icon>
        <span class="title-app-bar">Home</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-container>
      <router-view />
    </v-container>
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
.top-bar{
  border-bottom: #EB7A13 solid 3px;
}
</style>