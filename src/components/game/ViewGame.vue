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
       //return "/storage" + this.journey.imagePath;
       return 'http://localhost:3000/api/journey/'+ this.journey.user_id+'/'+fileName[4];
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
      this.$store
        .dispatch("deleteJourney", this.$route.params.id)
        .then(() => this.$router.go(-1))
        .catch(error => this.$snotify.error("Erro ao deletar jogo", "Erro"));
    }
  }
};
</script>
