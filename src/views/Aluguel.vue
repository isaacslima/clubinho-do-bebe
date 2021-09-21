<template>
  <div class="aluguel">
    <h1>Produtos</h1>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn color="teal" disabled @click="adicionarAluguel()">
        <v-icon dark left>
          mdi-plus
        </v-icon>Novo Aluguel
      </v-btn>
    </v-row>
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
  },
  data() {
    const defaultForm = Object.freeze({
        nomeProduto: '',
        nomeClient: ''
    })
    return {
      acaoAluguel: '',
      alugueis: [],
      form: Object.assign({}, defaultForm),
      dialog: false
    };
  },
  methods: {
    resetForm () {
    },
    adicionarAluguel () {
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