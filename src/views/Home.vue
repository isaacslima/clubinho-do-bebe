<template>
  <div class="home">
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
  </div>
</template>

<script>
  export default {
    data: () => ({
      items: [
        {
          icon: 'mdi-toy-brick',
          title: 'Produtos',
          subtitle: `Lista de produtos, preços e itens disponíveis para aluguel.`,
          location: '/produtos'
        },
        {
          icon: 'mdi-archive',
          title: 'Aluguel',
          subtitle: `Acompanhamento de itens locados e datas de devolução`,
          location: '/aluguel'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Clientes',
          subtitle: 'Cadastro e atualização de clientes',
          location: '/clientes'
        },
        {
          icon: 'mdi-calendar-multiselect',
          title: 'Calendário',
          subtitle: 'Calendário de itens locados, datas de devolução e agendamento',
          location: '/calendario'
        },
      ],
    }),
  }
</script>

<style>
.menu-home{
  border-bottom: 1px solid rgba(0,0,0,0.3);
}
</style>