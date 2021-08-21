<template>
  <div class="about">
    <h1>Produtos</h1>
    <v-row cols="12" md="12" style="margin-top: 31px"  v-for="(produto, index) in produtos" :key="produto.id">
      <v-container>
        <v-card class="mx-auto card-products" color="blue lighten-4" outlined>
          <v-chip class="info-mounth" dark color="indigo" dense x-small>{{ produto.faixaEtaria }}</v-chip> 
          <v-list-item three-line :key="index">
            <v-list-item-avatar
              tile
              size="80"
            >
            <img height="150" :src="produto.urlFoto"/>
            </v-list-item-avatar>
            <v-btn color="deep-purple lighten-2" text @click="editarProduto(produto.id)">
                    Editar
                  </v-btn>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ produto.nome }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ produto.descricao }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-row v-for="(preco) in produto.precos" :key="preco.id" >
              <v-col :cols="12/produto.precos" >
                <div class="label-price">
                  <v-icon dark>mdi-calendar</v-icon>
                  {{ preco.dias }} R$ {{ preco.preco }}
                </div>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-row>
    <v-row>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-form ref="form" @submit.prevent="salvar">
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
              <v-row v-for="(preco, index) in form.precos" :key="preco.id">
                {{ index }}
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="preco.preco" type="number" label="Valor" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="preco.dias" type="number" label="Dias" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar" :color="color">
      <v-icon dark>
        {{ icon }}
      </v-icon>
      <span>{{ mensagem }}</span>
    </v-snackbar>
    <v-btn color="pink" dark absolute bottom right fab @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import firebase from "../firebase/index";
import utils from "../shared/utils"
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
        precos: [
          { 
            preco: 0, 
            dias: 10, 
          },
          { 
            preco: 0, 
            dias: 20, 
          },
          { 
            preco: 0, 
            dias: 30, 
          }
        ],
      })
    return {
      form: Object.assign({}, defaultForm),
      produtos: [],
      unsubscribe: null,
      dialog: false,
      defaultForm,
      color: '',
      icon: '',
      mensagem: '',
      faixasEtarias : [
        '0 a 3 meses',
        '3 a 6 meses',
        '6 a 9 meses',
        '9 a 12 meses',
        'acima de 12 meses'
      ],
      snackbar: false
    };
  },
  computed: {
    formIsValid () {
      return (
        this.form.nome &&
        this.form.descricao &&
        this.form.faixaEtaria &&
        this.form.foto &&
        this.form.precos
      )
    },
  },
  methods: {
    resetForm () {
      this.form = Object.assign({}, this.defaultForm)
      this.$refs.form.reset()
      this.dialog = false
    },
    salvar () {
      this.loading = true;
      var self = this
      const storage = firebase.storage().ref();
      var nomeFoto = `${utils.newGuid()}.png`

      storage.child(`produtos/${nomeFoto}`).put(this.form.foto)
      .then(
        db.collection("produtos").add({
          nome: self.form.nome,
          foto: nomeFoto,
          descricao: self.form.descricao,
          faixaEtaria: self.form.faixaEtaria,
          precos: self.form.precos
        })
        .then(() => {
          this.mostraSnackbar('success', 'mdi-checkbox-marked-circle', 'Cadastro realizado com sucesso');
          this.dialog = false
          this.resetForm()
          this.buscarProdutos()
        })
        .catch((error) => {
          storage.ref(nomeFoto).delete()
          this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Cadastro não foi realizado mensagem técnica: ${error}`);
        })

      )
      .catch((error) => {
        this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Não foi possível enviar a foto mensagem técnica: ${error}`);
      });
    },
    mostraSnackbar(color, icon, mensagem) {
      this.snackbar = true
      this.loading = false
      this.mensagem = mensagem
      this.icon = icon
      this.color = color
    },
    buscarFoto (nomeFoto) {
      const storage = firebase.storage().ref();
      storage.child( `produtos/${nomeFoto}`).getDownloadURL().then(function(url) {
        return url;
    }).catch(function(error) {
      this.mostraSnackba('danger', '', `Não foi possível mostrar a imagem mensagem técnica ${error}`)
    });
    },
    buscarProdutos () {
      let _produtos = [];
      var self = this
      db.collection("produtos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var url = self.buscarFoto(doc.data().foto);
          _produtos.push({
            id: doc.id,
            nome: doc.data().nome,
            descricao: doc.data().descricao,
            faixaEtaria: doc.data().faixaEtaria,
            precos: doc.data().precos,
            foto: doc.data().foto,
            urlFoto: url
          });
        });
        self.produtos = _produtos;
      })
      .catch((error) => {
        this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Não foi possível buscar os produtos mensagem técnica: ${error}`);
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
.card-products {
  margin-bottom: 31px;
}
.label-price{
  background-color: #007E9E;
  border-radius: 3px;
  color: white;
  padding: 3px;
  display: inline-block
}
.info-mounth{
  position:relative;
  top: -14px;
}
</style>