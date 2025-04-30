<template id="show-game">
  <div class="animated flipInX">
    <h1>Dados do jogo</h1>
    <hr />
    <div>
      <b-card
        :title="journey.title"
        :img-src="image"
        img-alt="Image"
        img-top
        tag="article"
        class="mb-2"
      >
        <b-card-text>
          <span v-html="journey.description" />
        </b-card-text>
        <b-button @click.prevent="goBack" variant="primary">Voltar</b-button>
        <b-button @click.prevent="confirmDelete(journey)" variant="danger" v-if="canDelete">Deletar</b-button>
      </b-card>
    </div>
    <!-- <router-link v-bind:to="'/repository'">Back to post list</router-link> -->
  </div>
</template>

<script>
// import Snotify from "vue-snotify";
export default {
  props: ["id", "canDelete"],
  data() {
    return {
      journey: {}
    };
  },
  created: function() {
    let uri = "/journey/view/" + this.$route.params.id;
    axios.get(uri).then(response => {
      this.journey = response.data;
    });
  },
  computed: {
    image() {
      return "/storage/" + this.journey.imagePath;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    confirmDelete(journey) {
      this.journeyId = journey.id;
      self = this;

      this.$snotify.error(
        `Deseja realmente deletar o jogo: ${journey.title}?`,
        journey.title,
        {
          timeout: 5000,
          showProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          buttons: [
            {
              text: "Não",
              action: toast => {
                this.$snotify.remove(toast.id);
              }
            },
            {
              text: "Sim",
              action: toast => {
                this.destroy();
                this.$snotify.remove(toast.id);
              },
              bold: false
            }
          ]
        }
      );
    },
    destroy() {
      let url = "/journey/destroy/" + this.$route.params.id;
      axios
        .delete(url)
        .then(response => {
          this.journey = response.data;
          this.$router.go(-1);
        })
        .catch(error => {
          this.$snotify.error("Erro ao deletar jogo", "Erro");
        });
    }
  }
};
</script>
