<template>
  <div class="container my-8">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-default">
          <div class="card-header">
            <h3>Contato</h3>
          </div>
          <div class="text-center" v-if="sending">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
            <strong>Enviando...</strong>
          </div>
          <div class="card-body">
            <div class="alert alert-warning" v-if="error" v-text="error"></div>
            <form @submit.prevent="contact" class="form">
              <div class="form-group" :class="{ 'has-error': errors.name }">
                <label form="name">Nome</label>
                <b-form-input
                  type="text"
                  id="name"
                  v-model="form.name"
                  :state="nameState"
                  aria-describedby="input-name-help input-name-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-name-feedback">
                  <div v-for="(error, index) in errors.name" :key="index">{{ error }}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-name-help">Digite o seu nome</b-form-text>
              </div>
              <div class="form-group" :class="{ 'has-error': errors.email }">
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
                  <div v-for="(error, index) in errors.email" :key="index">{{ error }}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-name-help">Digite o seu email.</b-form-text>
              </div>
              <div class="form-group" :class="{ 'has-error': errors.password }">
                <label for="password">Mensagem</label>
                <b-form-textarea
                  rows="3"
                  max-rows="6"
                  id="message"
                  v-model="form.message"
                  :state="messageState"
                  aria-describedby="input-message-help input-message-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-message-feedback">
                  <div v-for="(error, index) in errors.message" :key="index">{{ error }}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-name-help">Digite a mensagem.</b-form-text>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Enviar</button>
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
        name: "",
        email: "",
        message: ""
      },
      errors: {},
      error: null,
      sending: false
    };
  },
  computed: {
    nameState() {
      return this.form.name && this.errors.name == null ? true : false;
    },
    emailState() {
      return this.form.email && this.errors.email == null ? true : false;
    },
    messageState() {
      return this.form.message && this.errors.message == null ? true : false;
    }
  },
  methods: {
    contact() {
      self = this;
      this.sending = true;
      axios
        .post("/api/submit", this.form)
        .then(response => {
          self.sending = false;
          self.$snotify.success("Mensagem enviada com sucesso", "OK");
          self.$router.push({ name: "History" });
        })
        .catch(error => {
          self.sending = false;
          this.errors = error.response.data.errors;
        });
    }
  }
};
</script>


