<template>
  <div class="produtos">
    <h1>Produtos</h1>
    <v-row cols="12" md="12" style="margin-top: 31px"  v-for="(produto, index) in produtos" :key="produto.id">
      <v-container>
        <v-card class="mx-auto card-products" color="blue lighten-4" outlined>
          <v-row class="info-mounth" dense>
            <v-col>
              <v-chip dark color="#007E9E" dense x-small>{{ produto.faixaEtaria }}</v-chip>
            </v-col>
            <v-col>
              <v-btn small color="indigo" dark @click="editarProduto(produto.id)">
                <v-icon dark left>
                  mdi-pencil
                </v-icon>Editar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn small dark @click="aluguelProduto(produto)">
                <v-icon dark left >
                  mdi-file-document-edit
                </v-icon>Aluguel
              </v-btn>
            </v-col>
            <v-col>
              <v-btn small color="red" dark @click="confirmarExcluirProduto(produto)">
                <v-icon dark left>
                  mdi-delete
                </v-icon>Excluir
              </v-btn>
            </v-col>
          </v-row>
          <v-list-item class="item-inside-card" three-line :key="index">
            <v-list-item-avatar tile size="100">
              <v-img height="100%" width="100%" :src="retornaUrlFoto(produto.foto)"/>
            </v-list-item-avatar>                
            <v-list-item-content>
              <v-list-item-title color="#EB7A13" class="text-h5 mb-1">
                <v-row>
                  <v-col cols="6">
                    {{ produto.nome }}
                  </v-col>
                  
                </v-row>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ produto.descricao }}
              </v-list-item-subtitle>
              
              
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-container fluid>
              <v-row >
                <v-col v-for="(preco) in produto.precos" :key="preco.id" cols="4" >
                  <div class="label-price">
                    <v-icon dark>mdi-calendar</v-icon> {{ preco.dias }} <br>
                    R$ {{ preco.preco }}
                  </div>
                </v-col>
              </v-row>  
            </v-container>
          </v-card-actions>
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
              <v-toolbar-title>{{ acaoProduto }}</v-toolbar-title>
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
              <v-row cols="12">
                <v-file-input 
                  :value="form.foto" 
                  v-model="form.foto" 
                  accept="image/*" 
                  label="Foto"
                  @change="onFilePicked"
                  :disabled="acaoProduto !== 'Adicionar Produto'"
                >
                </v-file-input>
              </v-row>
              <v-row cols="12">
                <div class="image-produto">
                  <v-img :src="imageUrl" contain height="300" width="300" aspect-ratio="1.7" />
                </div>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="form.nome" label="Nome" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field outlined v-model="form.codigo" label="Codigo" required></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
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
              <v-row v-for="(preco) in form.precos" :key="preco.id">
                <v-col cols="6" md="4">
                  <v-text-field outlined v-model="preco.dias" type="number" label="Dias" required></v-text-field>
                </v-col>
                <v-col cols="6" md="4">
                  <v-text-field outlined v-model="preco.preco" type="number" label="Valor" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="confirmarExcluir"
        width="500"
      >
        <v-card>
          <v-card-title class="font-weight-regular">
            Deseja realmente excluir <br><span class="font-weight-bold">{{ produtoExcluir.nome }}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#EB7A13"
              outlined
              @click="excluirProduto()"
            >
              Excluir
            </v-btn>
            <v-btn
              color="#EB7A13"
              dark
              @click="confirmarExcluir = false"
            >
              Cancelar
            </v-btn>
          </v-card-actions>
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
import utils from "../shared/utils"
import 'firebase/storage';
const db = firebase.firestore();

export default {
  name: "produtos",
  firestore: {
    produtos: db.collection('produtos'),
  },
  data() {
    const defaultForm = Object.freeze({
        foto: '',
        nome: '',
        codigo: '',
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
      acaoProduto: '',
      imageUrl: '',
      form: Object.assign({}, defaultForm),
      produtos: [],
      unsubscribe: null,
      dialog: false,
      defaultForm,
      foto: '',
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
      snackbar: false,
      loading: false,
      confirmarExcluir: false,
      produtoExcluir: ''
    };
  },
  computed: {
    formIsValid () {
      return (
        this.form.nome &&
        this.form.codigo &&
        this.form.descricao &&
        this.form.faixaEtaria &&
        this.form.precos
      )
    },
  },
  created() {
    this.$root.$refs.Children = this;
  },
  methods: {
    retornaUrlFoto(foto){
      return utils.retornaUrlImagem(foto);
    },
    resetForm () {
      this.form = Object.assign({}, this.defaultForm)
      this.$refs.form.reset()
      this.dialog = false
      this.imageUrl = ''
    },
    adicionarItem () {
      this.acaoProduto = 'Adicionar Produto'
      this.dialog = true;
    },
    editarProduto (idProduto) {
      this.acaoProduto = 'Editar Produto'
      this.form.id = idProduto
      this.dialog = true;
      db.collection('produtos')
      .doc(idProduto)
      .get()
      .then(snapshot => {
        const document = snapshot.data()
        this.form.nome = document.nome
        this.form.codigo = document?.codigo
        this.form.faixaEtaria = document.faixaEtaria
        this.form.descricao = document.descricao
        this.form.precos = document.precos
        this.form.foto = document.foto
        this.buscarFotoEdicao(this.form.foto)
      })
    },
    incluirNovoProduto () {
      var self = this
      const storage = firebase.storage().ref();
      var nomeFoto = `${utils.newGuid()}.png`

      storage.child(`produtos/${nomeFoto}`).put(this.form.foto)
      .then(
        db.collection("produtos").add({
          nome: self.form.nome,
          codigo: self.form.codigo,
          foto: nomeFoto,
          descricao: self.form.descricao,
          faixaEtaria: self.form.faixaEtaria,
          precos: self.form.precos
        })
        .then(() => {
          this.mostraSnackbar('success', 'mdi-checkbox-marked-circle', 'Cadastro realizado com sucesso');
          this.dialog = false
          this.resetForm()
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
    salvarProdutoEditado () {
      const produto = {
        id: this.form.id,
        nome: this.form.nome,
        codigo: this.form.codigo,
        foto: this.form.foto,
        descricao: this.form.descricao,
        faixaEtaria: this.form.faixaEtaria,
        precos: this.form.precos
      }
      db.collection('produtos')
        .doc(this.form.id)
        .set(produto)
        .then(()=> {
          this.mostraSnackbar('success', 'mdi-checkbox-marked-circle', 'Cadastro Atualizado com sucesso');
          this.dialog = false
          this.resetForm()
        })
        .catch((error) => {
          this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Não foi possível atualizer o produto mensagem técnica: ${error}`);
      })
    },
    salvar () {
      this.loading = true;
      if(this.acaoProduto === 'Adicionar Produto') {
        this.incluirNovoProduto()
        return
      }
      this.salvarProdutoEditado()
    },
    mostraSnackbar(color, icon, mensagem) {
      this.snackbar = true
      this.loading = false
      this.mensagem = mensagem
      this.icon = icon
      this.color = color
    },
    buscarFotoEdicao(nomeFoto){
      var self = this
      const storage = firebase.storage().ref();
      storage.child( `produtos/${nomeFoto}`).getDownloadURL().then(function(url) {
        self.imageUrl = url;
      }).catch(function(error) {
        self.mostraSnackbar('danger', '',`Não foi possível mostrar a imagem! Mensagem técnica ${error}`)
      });
    },
    buscarProdutos () {
      if(this.produtos.length > 0){
        this.produtos.forEach(element => {
        this.buscarPreencherFoto(element);
      });
      }
    },
    onFilePicked (){
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(this.form.foto)
    },
    confirmarExcluirProduto(produto) {
      this.confirmarExcluir = true;
      this.produtoExcluir = produto;
    },
    excluirProduto () {
      db.collection('produtos')
        .doc(this.produtoExcluir.id)
        .delete()
      this.confirmarExcluir = false;
    },
    aluguelProduto(produto){
      console.log(produto)
      this.$router.push({ path: 'aluguel' })
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
  z-index: 1;
}
.item-inside-card{
  margin-top: -30px;
}
.container-add-edit{
  margin-top: 48px;
}
</style>