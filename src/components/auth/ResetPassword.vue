<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-default">
          <div class="card-header">
            <h3>Cadastrar nova senha</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="resetPassword" method="post">
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
                <b-form-invalid-feedback id="input-name-feedback">
                  <div v-for="(error,index) in errors.email" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-name-help">Digite o seu email.</b-form-text>
              </div>
              <div class="form-group">
                <label for="password">Senha</label>
                <b-form-input
                  type="password"
                  id="password"
                  v-model="form.password"
                  :state="passwordState"
                  aria-describedby="input-password-help"
                  placeholder
                />
                <b-form-text id="input-password-help">Digite uma senha.</b-form-text>
              </div>
              <div class="form-group">
                <label for="email">Confirmar senha</label>
                <b-form-input
                  type="password"
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :state="confirmState"
                  aria-describedby="input-confirmpassword-help input-password-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-password-feedback">
                  <div v-for="(error,index) in errors.password" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-confirmpassword-help">Redigite a senha.</b-form-text>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Redefinir</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        token: null,
        email: null,
        password: null,
        password_confirmation: null
      },
      errors: {},
      error: null
    };
  },
  computed: {
    emailState() {
      return this.form.email && this.errors.email == null ? true : false;
    },
    passwordState() {
      return this.form.password && this.errors.password == null ? true : false;
    },
    confirmState() {
      return this.form.password_confirmation && this.errors.password == null
        ? true
        : false;
    }
  },
  methods: {
    resetPassword() {
      this.form.token = this.$route.params.token;
      let self = this;
      this.$store
        .dispatch("resetpassword", this.form)
        .then(() => {
          self.$router.push({ name: "login" });
        })
        .catch(error => {
          this.errors = error.errors;
        });
    }
  }
};
</script>
