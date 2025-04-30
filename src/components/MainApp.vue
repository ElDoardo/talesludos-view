<template>
  <div class="main">
    <Header />
    <div class="content">
      <router-view></router-view>
      <vue-snotify></vue-snotify>
      <Preloader></Preloader>
    </div>
  </div>
</template>

<script>
import Header from "./web/Header.vue";
import Preloader from "./web/Preloader.vue";
import api from '../api'

export default {
  name: "main-App",
  components: { Header, Preloader },
  created: function() {
    api.interceptors.response.use(undefined, (err) => {
      return new Promise((resolve, reject) => {
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        }
        throw err;
      });
    });
  }
};
</script>