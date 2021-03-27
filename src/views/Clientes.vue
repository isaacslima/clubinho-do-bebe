<template>
  <div class="about">
    <h1>Clientes</h1>
    {{ clientes }}
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
