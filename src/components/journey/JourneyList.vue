<template>
  <div class="animated bounce">
    <h1>Jogos de {{me.name}}</h1>

    <instructions />
    <hr />
    <router-link v-bind:to="{name: 'JourneyEdit', params: {id: 0, update:false}}">
      <b-button variant="primary" class="sm">
        Novo jogo
        <b-icon icon="file-earmark-plus"></b-icon>
      </b-button>
    </router-link>
    <!-- itens = journeys.journeys means store journeys in module journeys -->
    <div class="overflow-auto">
      <b-table
        small
        bordered
        head-variant="light"
        id="my-table"
        :fields="fields"
        :items="journeys.data"
        :per-page="perPage"
        :busy="loading"
      >
        <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>carregando...</strong>
          </div>
        </template>
        <template v-slot:cell(options)="data">
          <router-link v-bind:to="{name: 'JourneyEdit', params: {id: data.item.id, update:true}}">
            <b-button variant="primary" class="sm mx-0 my-0">
              <b-icon icon="pencil"></b-icon>
            </b-button>
          </router-link>
          <router-link v-bind:to="{name: 'Viewgame', params: {id: data.item.id, canDelete: true}}">
            <b-button variant="light" class="sm mx-0 my-0">
              <b-icon icon="eye"></b-icon>
            </b-button>
          </router-link>
          <b-button
            :href="playGame(data.item.user_id,data.item.id)"
            target="_blank"
            variant="success"
            class="sm mx-0 my-0"
          >
            <b-icon icon="controller"></b-icon>
          </b-button>
          <b-button
            @click="download(data.item.user_id,data.item.id)"
            variant="warning"
            class="sm mx-0 my-0"
          >
            <b-icon icon="cloud-download"></b-icon>
          </b-button>
        </template>
      </b-table>
      <b-pagination
        pills
        v-model="currentPage"
        :total-rows="rows"
        :current-page="currentPage"
        :per-page="perPage"
        aria-controls="my-table"
        @input="loadJourneys"
      ></b-pagination>
    </div>
    <!-- <b-card class="mt-3" header="Dados do Formulário">
      <pre class="m-0">{{ journeys }}</pre>
    </b-card>-->
  </div>
</template>

<script>
import instructions from "./Instructions.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    instructions
  },
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      fields: [
        { key: "title", label: "Título" },
        // { key: "description", label: "Descrição" },
        {
          key: "options",
          label: "Opções",
          //variant: "secondary",
          thStyle: { width: "210px" }
        }
      ]
      //journeys: []
    };
  },
  created() {
    this.loadJourneys();
  },
  computed: {
    // state.journeys.journeys = state journeys in journeys module
    ...mapState({
      journeys: state => state.journeys.journeys,
      loading: state => state.preloader.loading,
      me: state => state.auth.me
    }),
    rows() {
      return this.journeys.total;
    },
    params() {
      return {
        page: this.currentPage
      };
    }
  },
  methods: {
    ...mapActions(["fetchJourney"]),
    loadJourneys() {
      this.fetchJourney(this.params);
    },
    playGame(userid, id) {
      return "/storage/games/" + userid + "/" + id + "/Game1/index.html";
    },
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "talesludos.zip"); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    download(userid, id) {
      let uri = "api/journey/download/" + userid + "/" + id;
      axios({
        method: "get",
        url: uri,
        responseType: "arraybuffer"
      })
        .then(response => {
          this.forceFileDownload(response);
        })
        .catch(() => this.$snotify.error("Erro no download do jogo", "Erro"));
    }
  }
};
</script>
