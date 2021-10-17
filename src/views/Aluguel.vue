<template>
  <div class="aluguel">
    <h1>Produtos</h1>
    <v-row cols="12" md="12" style="margin-top: 31px"  v-for="(aluguel, index) in alugueis" :key="aluguel.id">
      <v-container>
        <v-card class="mx-auto card-products" color="blue lighten-4" outlined>
          <v-row class="info-mounth" dense>
            <v-col>
              <v-chip dark color="red lighten-3" dense x-small>Não entregue</v-chip>
            </v-col>
            <v-col>
              <v-btn small color="indigo" disabled @click="editarAluguel(aluguel.id)">
                <v-icon dark left>
                  mdi-pencil
                </v-icon>Editar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn small color="red" disabled @click="excluirAluguel(aluguel.id)">
                <v-icon dark left>
                  mdi-delete
                </v-icon>Excluir
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item class="item-inside-card" three-line :key="index">
            <v-list-item-avatar tile size="80">
              <v-img height="100%" width="100%" src="../assets/toys.png"/>
            </v-list-item-avatar>                
            <v-list-item-content>
                <v-container>
                    <v-row>
                        <b>
                    {{ aluguel.nomeProduto }}
                    </b>
                </v-row>                
                <v-row>
                    Data Aluguel: <b> {{ new Date(aluguel.dataInicio.seconds*1000).toLocaleDateString('pt-BR') }}</b>
                </v-row>
                <v-row>
                    Data Vencimento: {{ new Date(aluguel.dataFim.seconds*1000).toLocaleDateString('pt-BR') }}
                </v-row>
                
                <v-row>
                    Cliente: {{ aluguel.nomeCliente }} 
                    <v-icon @click="enviarMensagem(aluguel)">
                        mdi-whatsapp
                    </v-icon>
                </v-row>
                </v-container>
                
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-container>
    </v-row>
    <v-row>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-form ref="form" @submit.prevent="salvar">
            <v-app-bar dark fixed color="primary" dense elevate-on-scroll>
              <v-btn icon dark @click="resetForm">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ acaoAluguel }}</v-toolbar-title>
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
            <v-container class="container-add-edit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select outlined v-model="form.cliente" :items="clientes" label="Cliente" required
                    item-value="item"
                  >
                     <template v-slot:selection="data">
                        {{ data.item.nome }} - {{ data.item.telefone }}
                      </template>
                      <template v-slot:item="data">
                        {{ data.item.nome }} - {{ data.item.telefone }}
                      </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select 
                    outlined 
                    v-model="form.produto" 
                    :items="produtos" 
                    label="Produto"
                    item-value="item"
                    required
                  >
                  <template v-slot:selection="data">
                    {{ data.item.descricao }}
                  </template>
                  <template v-slot:item="data">
                    {{ data.item.descricao }}
                  </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="2">
                  <v-menu
                    outlined
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        v-model="form.dataAluguel"
                        label="Data Aluguel"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.dataAluguel"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select 
                      outlined 
                      v-model="form.precoDia" 
                      :items="form.produto.precos" 
                      label="Dias e Preço"
                      item-value="item"
                      required
                      :disabled="form.produto === ''"
                      >
                    <template v-slot:selection="data">
                      {{ data.item.dias }} dias R$ {{ data.item.preco}}
                    </template>
                    <template v-slot:item="data">
                      {{ data.item.dias }} dias R$ {{ data.item.preco}}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6" md="2">
                  <v-text-field outlined v-model="form.desconto" type="number" label="Desconto" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  {{ form.precoDia || json }}
                  Total R$ {{ form.precoDia.preco - form.desconto }}
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
  </div>
</template>
<script>
import firebase from "../firebase/index";
import 'firebase/storage';
const db = firebase.firestore();

export default {
  name: "aluguel",
  firestore: {
    alugueis: db.collection('aluguel'),
    produtos: db.collection('produtos'),
    clientes: db.collection('clientes')
  },
  data() {
    const defaultForm = Object.freeze({
        produto: '',
        cliente: '',
        dataAluguel: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        dataDevolucao: '',
        precoDia: {
          dias: 10,
          preco: 0
        },
        desconto: 0
    })
    return {
      acaoAluguel: '',
      alugueis: [],
      form: Object.assign({}, defaultForm),
      dialog: false,
      snackbar: false,
      mensagem: '',
      icon: '',
      color: '',
      menu: false
    };
  },
  created() {
    this.$root.$refs.Children = this;
  },
  computed: {
    formIsValid () {
      return (
        this.form.idProduto &&
        this.form.idCliente &&
        this.form.dataAluguel &&
        this.form.dataDevolucao
      )
    },
  },
  methods: {
    retornaStringCliente (cliente) {
      console.log(cliente);
      return 'teste';
    },
    resetForm () {
    },
    adicionarItem () {
      this.acaoAluguel = 'Adicionar Aluguel'
      this.dialog = true;
    },
    editarAluguel (idAluguel) {
      this.acaoProduto = 'Editar Aluguel'
      this.form.id = idAluguel
      this.dialog = true;
      db.collection('produtos')
      .doc(idAluguel)
      .get()
      .then(snapshot => {
        const document = snapshot.data()
        this.form.nomeProduto = document.nomeProduto
        this.form.nomeCliente = document.nomeCliente
      })
    },
    excluirAluguel (idAluguel) {
      db.collection('aluguel')
        .doc(idAluguel)
        .delete()
    },
    enviarMensagem (aluguel) {
        let dataInicio = new Date(aluguel.dataInicio.seconds*1000).toLocaleString('pt-BR')
        let mensagem = `https://wa.me/55${aluguel.telefone}/?text=Obrigado por alugar ${aluguel.nomeProduto} data do aluguel foi ${dataInicio}`
        window.open(mensagem, '_blank')
    }
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
.item-inside-card{
  margin-top: -30px;
}
.container-add-edit{
  margin-top: 48px;
}
</style>