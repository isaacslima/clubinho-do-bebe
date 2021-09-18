<template>
  <v-container class="home">
    <v-list three-line>
      <template v-for="(item) in items">
        <v-list-item
          :key="item.title"
          class="menu-home"
          @click="changePage(item.title)"
          :to="item.location"
        >
          <v-list-item-icon>
            <v-icon color="orange" x-large v-text="item.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import items from '../shared/items'

  export default {
    data: () => ({
      items: items
    })
  }
</script>

<style>
.menu-home{
  border-bottom: 1px solid rgba(0,0,0,0.3);
}
</style>