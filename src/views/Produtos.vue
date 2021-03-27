<template>
  <div class="about">
    <h1>Produtos</h1>
    {{ produtos }}
  </div>
</template>
<script>
import firebase from "../firebase/index";
const db = firebase.firestore();

export default {
  name: "produtos",
  data() {
    return {
      produtos: [],
      unsubscribe: null
    };
  },
  mounted () {
    let _produtos = [];
    var self = this
    db.collection("produtos")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        _produtos.push({
          id: doc.id,
          nome: doc.data().nome,
          localFoto: doc.data().localFoto,
          preco: doc.data().preco
        });
      });
      self.produtos = _produtos;
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  },
};
</script>
