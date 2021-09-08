<template>
  <v-container class="clientes">
    <v-row fixed>
      <v-col>
        <h1>Clientes</h1>
    </v-col>
    <v-spacer>
    </v-spacer>
    <v-col>
      <v-btn @click="adicionarCliente()">Novo Cliente</v-btn>
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
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-form ref="form" @submit.prevent="salvar">
            <v-app-bar dark fixed color="primary" dense elevate-on-scroll>
              <v-btn icon dark @click="resetForm">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ acaoCliente }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="resetForm" type="button">
                  Cancelar
                </v-btn>
                <v-btn dark text type="submit" :disabled="!formIsValid">
                  Salvar
                </v-btn>
              </v-toolbar-items>
            </v-app-bar>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field outlined v-model="form.nome" label="Nome" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field outlined v-model="form.telefone" label="Telefone" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field outlined v-model="form.cpf" label="CPF" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-dialog>
    <v-snackbar v-model="snackbar" :color="color">
      <v-icon dark>
        {{ icon }}
      </v-icon>
      <span>{{ mensagem }}</span>
    </v-snackbar>
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
    const defaultForm = Object.freeze({
        nome: '',
        telefone: '',
        cpf: '',
      })
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
      unsubscribe: null,
      snackbar: false,
      mensagem: '',
      color: '',
      icon: '',
      dialog: false,
      form: Object.assign({}, defaultForm),
      acaoCliente: ''
    };
  },
  mounted () {
  },
  methods: {
    adicionarCliente () {

    },
    salvar() {

    },
    resetForm () {
      this.form = Object.assign({}, this.defaultForm)
      this.$refs.form.reset()
      this.dialog = false
    },
  },
  computed: {
    formIsValid () {
      return (
        this.form.nome &&
        this.form.telefone &&
        this.form.cpf
      )
    },
  },
};
</script>
<style scoped>
.clientes{
  margin-top: 30px;
}
</style>