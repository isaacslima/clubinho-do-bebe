<template>
  <v-container class="clientes">
    <v-row fixed>
      <v-col>
        <h1>Clientes</h1>
    </v-col>
    <v-spacer>
    </v-spacer>
    <v-col>
      <v-btn>Novo Cliente</v-btn>
    </v-col>
    </v-row>
    
    
    <v-card>
      <v-card-title>
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          hide-default-header
          :items="clientes"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-card-title>
    </v-card>
  </v-container>
</template>
<script>
import firebase from "../firebase/index";
import 'firebase/storage';
const db = firebase.firestore();

export default {
  name: "clientes",
  firestore: {
    clientes: db.collection('clientes'),
  },
  data() {
    return {
      search: '',
      clientes: [],
      headers: [
          {
            text: 'Nome',
            align: 'start',
            value: 'nome',
            filterable: true,
          },
          { text: 'Telefone', value: 'telefone' },
          { text: 'CPF', value: 'cpf' },
        ],
      unsubscribe: null
    };
  },
  mounted () {
  },
};
</script>
<style scoped>
.clientes{
  margin-top: 30px;
}
</style>