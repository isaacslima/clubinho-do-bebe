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
        this.form.preco1 &&
        this.form.preco2 &&
        this.form.preco3
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
      const storage = firebase.storage();
      var nomeFoto = `${utils.newGuid()}.png`

      storage.ref(nomeFoto).put(this.form.foto)
      .then(
        db.collection("produtos").add({
          nome: self.form.nome,
          foto: nomeFoto,
          descricao: self.form.descricao,
          faixaEtaria: self.form.faixaEtaria,
          preco1: self.form.preco1,
          preco2: self.form.preco2,
          preco4: self.form.preco3
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
</style>