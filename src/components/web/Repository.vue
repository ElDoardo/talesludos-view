<template>
  <div class="animated slideInLeft">
    <h1>Repositório de Jogos</h1>

    <instructions />
    <div>
      <b-form-group
        label="Área:"
        label-for="area"
        description="Escolha a área de conhecimento relacionada ao jogo"
      >
        <b-form-select @input="searchArea" v-model="areaSelected" :options="areasToSelect"></b-form-select>
      </b-form-group>
    </div>
    <div class="overflow-auto">
      <b-table
        small
        borderless
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
        <template v-slot:cell(details)="row">
          <b-button variant="light" @click="row.toggleDetails" class="sm mx-0 my-0">
            <b-icon :icon="row.detailsShowing ? 'eye-slash' : 'eye'"></b-icon>
          </b-button>
          <b-button
            :href="playGame(row.item.user_id, row.item.id)"
            target="_blank"
            variant="success"
            class="sm mx-0 my-0"
          >
            <b-icon icon="controller"></b-icon>
          </b-button>
          <b-button
            @click="download(row.item.user_id, row.item.id)"
            variant="warning"
            class="sm mx-0 my-0"
          >
            <b-icon icon="cloud-download"></b-icon>
          </b-button>
        </template>

        <template v-slot:row-details="row">
          <b-card no-body class="overflow-hidden">
            <b-row no-gutters>
              <b-col md="4">
                <b-card-img
                  :src="backImage(row.item.imagePath)"
                  alt="imagem de fundo"
                  class="rounded-0"
                ></b-card-img>
              </b-col>
              <b-col md="8">
                <b-card-body :title="row.item.title">
                  <b-card-text>
                    <span v-html="row.item.description"></span>
                  </b-card-text>
                </b-card-body>
                <b-card-body>Autor: {{row.item.name}}</b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
      <b-pagination
        pills
        v-model="currentPage"
        :current-page="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        @input="loadAllJourneys"
      ></b-pagination>
    </div>
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
      areaSelected: "",
      areasToSelect: [],
      perPage: 3,
      currentPage: 1,
      fields: [
        { key: "title", label: "Tĩtulo" },
        { key: "details", label: "Opções", thStyle: { width: "160px" } }
      ]
    };
  },
  created() {},
  mounted() {
    this.loadAllJourneys();
    // this.$store.dispatch("fetchareas");
    // console.log("fetch areas");
    for (let i = 0; i < this.areas.length; i++)
      this.areasToSelect.push({
        value: this.areas[i].id,
        text: this.areas[i].title
      });
    this.areasToSelect.push({
      value: "",
      text: "TODAS"
    });
  },
  computed: {
    ...mapState({
      areas: state => state.areas.areas,
      journeys: state => state.journeys.journeys,
      loading: state => state.preloader.loading
    }),
    rows() {
      return this.journeys.total;
    },
    params() {
      return {
        page: this.currentPage,
        area: this.areaSelected
      };
    }
  },
  methods: {
    ...mapActions(["fetchAllJourney"]),
    loadAllJourneys() {
      this.fetchAllJourney(this.params);
    },
    searchArea() {
      //   console.log("Pesquisar..." + this.areaSelected);
      this.currentPage = 1;
      this.loadAllJourneys();
    },
    backImage(imagePath) {
      return "/storage/" + imagePath;
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
        .catch(() => console.log("error occured"));
    }
  }
};
</script>
