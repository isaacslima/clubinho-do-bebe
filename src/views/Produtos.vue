<template>
  <div class="about">
    <h1>Produtos</h1>
    <v-list three-line>
      <template v-for="(produto, index) in produtos">
        <v-divider :key="index" inset></v-divider>

        <v-list-item :key="produto.nome">
          <v-list-item-avatar class="avatar">
            <img :src="produto.localFoto"/>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="produto.nome"></v-list-item-title>
            <v-list-item-subtitle> Preço <b>R$ {{ produto.preco }}</b></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
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
<style>
.avatar{
  height: 60px !important;
  min-width: 60px !important;
  width: 60px !important;
}
</style>