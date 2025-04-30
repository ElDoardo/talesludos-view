<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" class="mb-2">
    <b-navbar-brand :to="{ path: '/' }">
      <img src="/images/logo-150.png" alt="Tales Ludos" />
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{name: 'Repository'}">Repositório</b-nav-item>
        <div v-if="authenticated">
          <b-nav-item :to="{name: 'JourneyList'}">Criar Jogos</b-nav-item>
        </div>
        <b-nav-item :to="{name: 'Contact'}">Contato</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <template v-if="!authenticated">
          <b-nav-item-dropdown text="Entrar" right>
            <b-dropdown-item href="#">
              <router-link :to="{ name: 'login' }">Entrar</router-link>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <router-link :to="{ name: 'register' }">Registrar-se</router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </template>
        <template v-else>
          <b-nav-item-dropdown :text="me.name" right>
            <b-dropdown-item @click.prevent="logout">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-header",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  mounted: function() {
    // console.log("Logado = " + this.authenticated);
  },
  computed: {
    // state.auth.me = state me in auth module vuex
    ...mapState({
      me: state => state.auth.me,
      authenticated: state => state.auth.authenticated
    })
  }
};
</script>
