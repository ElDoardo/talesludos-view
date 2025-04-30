<template>
  <div class="container my-8">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-default">
          <div class="card-header">
            <h3>Redefinir senha</h3>
          </div>
          <div class="text-center" v-if="sending">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
            <strong>Enviando...</strong>
          </div>
          <div class="card-body">
            <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
              <div class="form-group">
                <label for="email">E-mail</label>
                <b-form-input
                  type="email"
                  id="email"
                  v-model="email"
                  :state="emailState"
                  aria-describedby="input-email-help input-email-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-email-feedback">
                  <div v-for="(error,index) in errors.email" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-email-help">Digite o seu email.</b-form-text>
              </div>
              <button type="submit" class="btn btn-success">Enviar link</button>
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
      email: null,
      error: null,
      errors: {},
      sending: false
    };
  },
  computed: {
    emailState() {
      return this.email && this.errors.email == null ? true : false;
    }
  },
  methods: {
    requestResetPassword() {
      let self = this;
      this.sending = true;
      this.$store
        .dispatch("forgotpassword", { email: self.email })
        .then(() => {
          self.$snotify.success("Link enviado para o email", "OK");
          self.$router.push({ name: "History" });
          self.sending = false;
        })
        .catch(error => {
          this.errors = error.errors;
          self.sending = false;
        });
    }
  }
};
</script>
