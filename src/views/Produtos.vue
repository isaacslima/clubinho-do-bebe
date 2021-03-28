<template>
  <div class="about">
    <h1>Produtos</h1>
    <v-row>
      <v-col cols="12" md="3"  v-for="(produto, index) in produtos" :key="produto.id">
        <v-card class="mx-auto my-12" max-width="374" :key="index">
          <img height="150" :src="produto.localFoto" />
          <v-card-title>{{ produto.nome }}  
             <v-chip>{{ produto.faixaEtaria }}</v-chip> 
          </v-card-title>
          <v-card-text>
            <div>{{ produto.descricao }}</div>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-chip-group active-class="deep-purple accent-4 white--text" column>
              <v-chip>10 dias - R$ {{ produto.preco1 }}</v-chip> 
              <v-chip>20 dias - R$ {{ produto.preco2 }}</v-chip>
              <v-chip>30 dias - R$ {{ produto.preco3 }}</v-chip>
            </v-chip-group>
          </v-card-text>

          <v-card-actions>
            <v-btn color="deep-purple lighten-2" text @click="editarProduto(produto.id)">
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-form ref="form" @submit.prevent="submit">
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="resetForm">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Criar Produto</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="resetForm" type="button">
                  Cancelar
                </v-btn>
                <v-btn dark text type="submit" :disabled="!formIsValid">
                  Salvar
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-container>
              <v-row cols="12">
                <v-file-input :value="form.foto" v-model="form.foto" accept="image/*" label="Foto"></v-file-input>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field outlined v-model="form.nome" label="Nome" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select outlined v-model="form.faixaEtaria" :items="faixasEtarias" label="Faixa Etária"
                     required></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea outlined v-model="form.descricao" label="Descrição" required>
                  </v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="form.preco1" label="Preço 10 dias" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="form.preco2" label="Preço 20 dias" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="form.preco3" label="Preço 30 dias" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
        <v-snackbar v-model="snackbarFail" color="danger">
          <v-icon dark>
            mdi-checkbox-marked-circle
          </v-icon>
          <span>Registration fail!</span>
        </v-snackbar>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbarSucess" color="success">
      <v-icon dark>
        mdi-checkbox-marked-circle
      </v-icon>
      <span>Registration successful!</span>
    </v-snackbar>
    <v-btn color="pink" dark absolute bottom right fab @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import firebase from "../firebase/index";
import 'firebase/storage';
const db = firebase.firestore();


export default {
  name: "produtos",
  data() {
    const defaultForm = Object.freeze({
        foto: '',
        nome: '',
        descricao: '',
        faixaEtaria: '',
        preco1: '',
        preco2: '',
        preco3: '',
      })
    return {
      form: Object.assign({}, defaultForm),
      produtos: [],
      unsubscribe: null,
      dialog: false,
      defaultForm,
      faixasEtarias : [
        '0 a 3 meses',
        '3 a 6 meses',
        '6 a 9 meses',
        '9 a 12 meses',
        'acima de 12 meses'
      ],
      snackbarSucess: false,
      snackbarFail: false
    };
  },
  computed: {
    formIsValid () {
      return (
        this.form.nome &&
        this.form.descricao &&
        this.form.faixaEtaria &&
        this.form.foto &&
        this.form.preco1 &&
        this.form.preco2 &&
        this.form.preco3
      )
    },
  },
  methods: {
    resetForm () {
      const storage = firebase.storage();

      storage.ref('mountains.jpg').put(this.form.foto);
 
      // this.form = Object.assign({}, this.defaultForm)
      // this.$refs.form.reset()
      // this.dialog = false
    },
    submit () {
      var self = this
      db.collection("produtos").add({
          nome: self.form.nome,
          descricao: self.form.descricao,
          faixaEtaria: self.form.faixaEtaria,
          preco1: self.form.preco1,
          preco2: self.form.preco2,
          preco4: self.form.preco3
      })
      .then(() => {
        this.snackbarSucess = true
        this.dialog = false
        this.resetForm()
        this.buscarProdutos()
      })
      .catch((error) => {
        this.snackbarFail = true
        console.error("Error writing document: ", error);
      });
      
    },
    buscarProdutos () {
      let _produtos = [];
      var self = this
      db.collection("produtos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          _produtos.push({
            id: doc.id,
            nome: doc.data().nome,
            descricao: doc.data().descricao,
            localFoto: doc.data().localFoto,
            faixaEtaria: doc.data().faixaEtaria,
            preco1: doc.data().preco1,
            preco2: doc.data().preco2,
            preco3: doc.data().preco3
          });
        });
        self.produtos = _produtos;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    }
  },
  mounted () {
    this.buscarProdutos()
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