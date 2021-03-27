<template>
  <div class="about">
    <h1>Clientes</h1>
    <v-data-table
      :headers="headers"
      :items="clientes"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
    <div v-for="item in clientes" :key="item.message">
    </div>
  </div>
</template>
<script>
import firebase from "../firebase/index";
const db = firebase.firestore();

export default {
  name: "clientes",
  data() {
    return {
      clientes: [],
      headers: [
          {
            text: 'Nome',
            align: 'start',
            value: 'nome',
          },
          { text: 'Telefone', value: 'telefone' },
          { text: 'CPF', value: 'cpf' },
        ],
      unsubscribe: null
    };
  },
  mounted () {
    let _clientes = [];
    var self = this
    db.collection("clientes")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        _clientes.push({
          id: doc.id,
          nome: doc.data().nome,
          telefone: doc.data().telefone,
          cpf: doc.data().cpf
        });
      });
      self.clientes = _clientes;
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  },
};
</script>
