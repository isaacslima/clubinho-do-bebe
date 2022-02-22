<template>
  <div class="aluguel">
    <h1>Produtos</h1>
    <v-row cols="12" md="12" style="margin-top: 31px"  v-for="(aluguel, index) in alugueis" :key="aluguel.id">
      <v-container>
        <v-card class="mx-auto card-products" color="blue lighten-4" outlined>
          <v-row class="info-mounth" dense>
            <v-col>
              <v-chip dark color="red lighten-3" dense x-small>Entregue</v-chip>
            </v-col>
            <v-col>
              <v-btn small color="indigo" disabled @click="editarAluguel(aluguel.id)">
                <v-icon dark left>
                  mdi-pencil
                </v-icon>Editar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn small color="red" dark @click="excluirAluguel(aluguel.id)">
                <v-icon dark left>
                  mdi-delete
                </v-icon>Excluir
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item class="item-inside-card" three-line :key="index">
            <v-list-item-avatar tile size="80">
              <v-img height="100%" width="100%" :src="retornaImagemProduto(aluguel.produto.foto)"/>
            </v-list-item-avatar>                
            <v-list-item-content>
                <v-container>
                    <v-row>
                        <b>
                    {{ aluguel.produto.nome }}
                    </b>
                </v-row>                
                <v-row>
                    Data Aluguel: <b> {{ new Date(aluguel.dataAluguel.seconds*1000).toLocaleDateString('pt-BR') }}</b>
                </v-row>
                <v-row>
                    Data Vencimento: {{ new Date(aluguel.dataDevolucao.seconds*1000).toLocaleDateString('pt-BR') }}
                </v-row>
                
                <v-row>
                    Cliente: {{ aluguel.cliente.nome }} 
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
                <v-col cols="12" md="4">
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
                <v-col cols="12" v-if="form.produto">
                  <v-img  :src="retornaImagemProduto(form.produto.foto)"></v-img>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select 
                    outlined 
                    v-model="form.produto" 
                    :items="produtos" 
                    label="Produto"
                    item-value="item"
                    required
                    @change="preenchePrecos()"
                  >
                    <template v-slot:selection="data">
                      {{ data.item.nome }}
                    </template>
                    <template v-slot:item="data">
                      {{ data.item.nome }}
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
                        locale="pt-BR"
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
                      locale="pt-BR"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select 
                      outlined 
                      v-model="form.precoDia" 
                      :items="precos" 
                      label="Dias e Preço"
                      item-value="item"
                      required
                      :disabled="form.produto === ''"
                      @change="atualizarDataDevolucao()"
                      >
                    <template v-slot:selection="data">
                      {{ data.item.dias }} dias R$ {{ data.item.preco }}
                    </template>
                    <template v-slot:item="data" >
                      {{ data.item.dias }} dias R$ {{ data.item.preco }}
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6" md="2">
                  <v-text-field outlined v-model="form.desconto" type="number" label="Desconto" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  Total R$ {{ valorTotal }} Data devolução {{ form.dataDevolucao | formatDate }}
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
import Vue from 'vue'
import utils from '@/shared/utils';
const db = firebase.firestore();

Vue.filter('formatDate', function(value) {
  if(value){
    return value.toLocaleDateString('pt-BR');
  }
})
export default {
  name: "aluguel",
  firestore: {
    alugueis: db.collection('aluguel').orderBy("dataDevolucao", "asc"),
    produtos: db.collection('produtos'),
    clientes: db.collection('clientes')
  },
  data() {
    const defaultForm = Object.freeze({
      produto: '',
      cliente: '',
      dataAluguel: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      precoDia: {
        dias: 10,
        preco: 0
      },
      desconto: 0,
      dataDevolucao: ''
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
      menu: false,
      loading: false,
      valorTotal: 0,
      precos: []
    };
  },
  created() {
    this.$root.$refs.Children = this;
  },
  computed: {
    formIsValid () {
      return (
        this.form.produto &&
        this.form.cliente &&
        this.form.dataAluguel &&
        this.form.dataDevolucao
      )
    },
  },
  methods: {
    retornaImagemProduto(foto) {
      return utils.retornaUrlImagem(foto);
    },
    preenchePrecos () {
      this.precos = this.form.produto.precos;
    },
    retornaDataAluguel(dataString) {
      const [ ano, mes, dia ] = dataString.split('-');
      return new Date(ano, mes-1, dia);
    },
    atualizarDataDevolucao () {
      this.valorTotal = this.form.precoDia.preco - this.form.desconto;
      var data = this.retornaDataAluguel(this.form.dataAluguel)
      this.form.dataDevolucao = this.adicionarDias(data, this.form.precoDia.dias)
    },
    adicionarDias (date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
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
    adicionarItem () {
      this.acaoAluguel = 'Adicionar Aluguel'
      this.form.dataAluguel = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      this.dialog = true;
    },
    salvar () {
      this.loading = true
      if(this.acaoAluguel === 'Adicionar Aluguel') {
        this.incluirNovoAluguel()
        return
      }
      this.salvarAluguelEditado()
    },
    salvarAluguelEditado () {

    },
    incluirNovoAluguel () {
      var self = this
      db.collection("aluguel").add({
        produto: self.form.produto,
        cliente: self.form.cliente,
        dataAluguel: this.retornaDataAluguel(self.form.dataAluguel),
        dataDevolucao: self.form.dataDevolucao,
        desconto: self.form.desconto ?? 0,
        precoDia: self.form.precoDia
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
    editarAluguel (idAluguel) {
      this.acaoProduto = 'Editar Aluguel'
      this.form.id = idAluguel
      this.dialog = true;
      db.collection('aluguel')
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
      console.log(aluguel)
      let dataAluguel = new Date(aluguel.dataAluguel.seconds*1000).toLocaleDateString('pt-BR')
      let mensagem = `https://wa.me/+55${aluguel.cliente.telefone}/?text=Obrigado por alugar ${aluguel.produto.nome} data do aluguel foi ${dataAluguel}`

      console.log(mensagem);
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