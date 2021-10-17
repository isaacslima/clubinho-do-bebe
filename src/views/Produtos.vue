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
              <v-btn small color="red" dark @click="excluirProduto(produto.id)">
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
              <v-container fluid>
                <v-row >
                  <v-col v-for="(preco) in produto.precos" :key="preco.id" cols="4" >
                    <div class="label-price">
                      <v-icon dark>mdi-calendar</v-icon>
                      {{ preco.dias }} R$ {{ preco.preco }}
                    </div>
                  </v-col>
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
                  <v-img :src="imageUrl" />
                </div>
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
      loading: false
    };
  },
  computed: {
    formIsValid () {
      return (
        this.form.nome &&
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
        foto: this.form.nomeFoto,
        descricao: this.form.descricao,
        faixaEtaria: this.form.faixaEtaria,
        precos: this.form.precos
      }
      const storage = firebase.storage().ref();

      storage.child(`produtos/${this.form.nomeFoto}.png`)
      .put(this.form.foto)
      .then(
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
      )
      .catch((error) => {
        this.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Não foi possível atualizar a foto mensagem técnica: ${error}`);
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
    buscarFoto (nomeFoto) {
      var self = this
      const storage = firebase.storage().ref();
      storage.child( `produtos/${nomeFoto}`).getDownloadURL().then(function(url) {
        return url;
      }).catch(function(error) {
        self.mostraSnackbar('danger', '', `Não foi possível mostrar a imagem! Mensagem técnica ${error}`)
      });
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
            faixaEtaria: doc.data().faixaEtaria,
            precos: doc.data().precos,
            foto: doc.data().foto
          });
        });
        self.produtos = _produtos;
      })
      .finally(() => {
        self.produtos.forEach(element => {
          var foto = self.buscarFoto(element.foto);
          element.urlFoto = foto;
        });
      })
      .catch((error) => {
        self.mostraSnackbar('danger', 'mdi-checkbox-marked-circle', `Não foi possível buscar os produtos mensagem técnica: ${error}`);
      });
    },
    onFilePicked (){
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(this.form.foto)
    },
    excluirProduto (idProduto) {
      db.collection('produtos')
        .doc(idProduto)
        .delete()
    },
    aluguelProduto(produto){
      console.log(produto)
      this.$router.push({ path: 'aluguel' })
    }
  },
  mounted () {
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