<template>
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4">
				<v-card class="elevation-12">
					<v-toolbar color="primary" dark flat>
						<v-toolbar-title>Login</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-text>
						<v-form>
							<v-text-field label="Login" name="login" v-model="email" prepend-icon="mdi-account" type="text"></v-text-field>
							<v-text-field id="password" label="Password" v-model="password" name="password" prepend-icon="mdi-lock" type="password">
							</v-text-field>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" @click="doLogin()">Entrar</v-btn>
					</v-card-actions>
				</v-card>
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
    password: ''
  }),
  methods: {
    doLogin() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace('/home')
        }).catch(function () {
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