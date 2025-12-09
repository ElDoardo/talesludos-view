<template>
  <div class="animated flipInX">
    <h1>{{journey.title}}</h1>
    <b-card>
      <mdb-media>
        <mdb-media-image
          :src="image"
          style="width: 150px"
          class="d-flex mr-3"
          alt="Imagem do jogo"
        />
        <mdb-media-body>
          <span v-html="journey.description" />
        </mdb-media-body>
      </mdb-media>
      <b-button @click.prevent="goBack" variant="primary">Voltar</b-button>
      <b-button @click.prevent="confirmDelete(journey)" variant="danger" v-if="canDelete">Deletar</b-button>
    </b-card>
  </div>
</template>

<script>
import { mdbMedia, mdbMediaBody, mdbMediaImage } from "mdbvue";
export default {
  components: {
    mdbMedia,
    mdbMediaBody,
    mdbMediaImage
  },
  props: ["id", "canDelete"],
  data() {
    return {
      journey: {}
    };
  },
  created: function() {
    this.journey = this.$store.getters.getJourney(this.$route.params.id);
  },
  computed: {
    image() {
      console.log(this.journey)
      const fileName = this.journey.imagePath.split('/');
       return `http://localhost:3000/api/users/${this.journey.user_id}/files/${fileName[1]}`;
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "JourneyList", params: { all: false } });
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
      this.$store
        .dispatch("deleteJourney", this.$route.params.id)
        .then(() => this.$router.push({ name: "JourneyList", params: { all: false } }))
        .catch(error => this.$snotify.error("Erro ao deletar jogo", "Erro"));
    }
  }
};
</script>
