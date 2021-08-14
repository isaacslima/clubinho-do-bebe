<template>
	<v-container class="fill-height login" fluid>
		<v-row align="center" justify="bottom">
			<v-col cols="12" sm="8" md="4">
				<div>
					Login
				</div>
				<div>
					<v-form>
						<v-text-field label="Email" name="email" v-model="email" type="text" solo placeholder="Digite seu e-mail">
						</v-text-field>
						<v-text-field id="password" label="Senha" solo v-model="password" name="password" type="password" placeholder="Digite sua senha">
						</v-text-field>
						</v-form>
				</div>
				<div>
					<v-btn color="primary" @click="doLogin()" :disabled="loading" depressed >Entrar</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import firebase from 'firebase'
import Vue from 'vue'

export default {
	data: () => ({
    email: '',
    password: '',
		loading: false
  }),
  methods: {
    doLogin() {
			var self = this
			this.loading = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((userCredencial) => {
					var user = userCredencial.user;
					console.log(user);
          this.$router.replace('/home')
        }).catch(function () {
					self.loading = false;
          // self.snackbar = true
          // self.color = 'error'
          // self.msg = 'Senha ou email incorretos'
        })
    },
    salvaUid () {
      var user = firebase.auth().currentUser
      Vue.$localStorage.set('id', user.uid)
    },
  }
}
</script>

<style>
	.login {
		background: linear-gradient(0deg, rgba(255,255,255,1) 32%, rgba(206,248,255,1) 67%, rgba(224,250,255,1) 100%);
	}
</style>