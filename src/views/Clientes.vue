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
          :search="search"
          sort-by="nome"
          :items="clientes"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editarCliente(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
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
                <v-btn dark text type="submit" :disabled="!formIsValid || loading">
                  Salvar
                </v-btn>
              </v-toolbar-items>
            </v-app-bar>
            <v-container class="container-add-client">
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
          },
          { text: 'Telefone', value: 'telefone' },
          { text: 'CPF', value: 'cpf' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      unsubscribe: null,
      snackbar: false,
      mensagem: '',
      color: '',
      icon: '',
      dialog: false,
      form: Object.assign({}, defaultForm),
      acaoCliente: '',
      loading: false
    };
  },
  mounted () {
  },
  methods: {
    adicionarCliente () {
      this.acaoCliente = 'Adicionar Cliente'
      this.dialog = true
    },
    incluirNovoCliente () {
      var self = this

      db.collection("clientes").add({
        nome: self.form.nome,
        telefone: self.form.telefone,
        cpf: self.form.cpf
      })
      .then(() => {
        this.mostraSnackbar('success', 'mdi-checkbox-marked-circle', 'Cadastro realizado com sucesso');
        this.dialog = false
        this.resetForm()
      })
      .catch((error) => {
        this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Cadastro não foi realizado mensagem técnica: ${error}`);
      })
    },
    salvar () {
      this.loading = true;
      if(this.acaoCliente === 'Adicionar Cliente'){
        this.incluirNovoCliente()
        return
      }

      this.salvarClienteEditado()
    },
    salvarClienteEditado () {
      const client = {
        id: this.form.id,
        nome: this.form.nome,
        telefone: this.form.telefone,
        cpf: this.form.cpf
      }
      db.collection('clientes')
        .doc(this.form.id)
        .set(client)
        .then(() => {
          console.log('client updated!')
        })
    },
    resetForm () {
      this.form = Object.assign({}, this.defaultForm)
      this.$refs.form.reset()
      this.dialog = false
    },
    mostraSnackbar(color, icon, mensagem) {
      this.snackbar = true
      this.loading = false
      this.mensagem = mensagem
      this.icon = icon
      this.color = color
    },
    editarCliente (cliente) {
      this.acaoCliente = 'Editar Cliente'
      this.form.id = cliente.id
      this.form.nome = cliente.nome
      this.form.telefone = cliente.telefone
      this.form.cpf = cliente.cpf
      this.dialog = true
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
.container-add-client{
  margin-top: 48px;
}
</style>