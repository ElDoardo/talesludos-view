<template>
  <div class="container my-8">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card card-default">
          <div class="card-header">
            <h3>Registrar-se</h3>
          </div>
          <div class="card-body">
            <div class="alert alert-warning" v-if="error" v-text="error"></div>
            <form @submit.prevent="register" class="form">
              <div class="form-group">
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
                  <div v-for="(error,index) in errors.name" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-name-help">Digite o seu nome</b-form-text>
              </div>
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
                  aria-describedby="input-password-help input-password-feedback"
                  placeholder
                />
                <b-form-invalid-feedback id="input-password-feedback">
                  <div v-for="(error,index) in errors.password" :key="index">{{error}}</div>
                </b-form-invalid-feedback>
                <b-form-text id="input-password-help">Digite uma senha.</b-form-text>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Registrar-se</button>
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
        password: ""
      },
      errors: {},
      error: null
    };
  },
  computed: {
    nameState() {
      return this.form.name && this.errors.name == null ? true : false;
    },
    emailState() {
      return this.form.email && this.errors.email == null ? true : false;
    },
    passwordState() {
      return this.form.password && this.errors.password == null ? true : false;
    }
  },
  methods: {
    register() {
      self = this;
      this.$store
        .dispatch("register", this.form)
        .then(() => {
          self.$snotify.success("Usuário cadastrado com sucesso", "OK");
          self.$router.push({ name: "JourneyList" });
        })
        .catch(error => {
          this.errors = error.errors;
        });
    }
  }
};
</script>


