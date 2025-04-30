<template>
  <div class="container my-8">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-default">
          <div class="card-header">
            <h3>Entrar</h3>
          </div>
          <div class="card-body">
            <div class="alert alert-warning" v-if="error" v-text="error"></div>
            <form @submit.prevent="login" class="form">
              <div class="form-group">
                <label for="email">E-mail</label>
                <b-form-input
                  type="email"
                  id="email"
                  v-model="form.email"
                  :state="emailState"
                  aria-describedby="input-email-help input-email-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-email-feedback">
                  <div v-for="(error,index) in errors.email" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-email-help">Digite o seu email.</b-form-text>
              </div>
              <div class="form-group">
                <label for="password">Senha</label>
                <b-form-input
                  type="password"
                  id="password"
                  v-model="form.password"
                  :state="passwordState"
                  aria-describedby="input-password-help input-password-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-password-feedback">
                  <div v-for="(error,index) in errors.password" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-password-help">Digite uma senha.</b-form-text>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Entrar</button>
              </div>
              <a>
                <router-link :to="{ name: 'forgotpassword' }">Esqueci minha senha</router-link>
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errors: {},
      error: ""
    };
  },
  computed: {
    emailState() {
      return this.form.email && this.errors.email == null ? true : false;
    },
    passwordState() {
      return this.form.password && this.errors.password == null ? true : false;
    }
  },
  methods: {
  login() {
    let self = this;
    this.error = ""; // Limpa erros anteriores
    this.errors = {}; // Limpa erros de validação
    
    this.$store
      .dispatch("login", this.form)
      .then(() => {
        self.$snotify.success("Sucesso ao logar", "OK");
        self.$router.push({ name: "JourneyList" });
      })
      .catch(error => {
        if (error.errors) {
          // Erros de validação da API
          self.errors = error.errors;
        } else {
          // Outros erros
          self.error = error.message || "Ocorreu um erro ao tentar fazer login";
        }
        self.$snotify.error("Falha ao logar no sistema", "Erro");
      });
  }
}
};
</script>
