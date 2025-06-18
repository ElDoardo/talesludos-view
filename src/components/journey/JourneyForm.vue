<template>
  <div class="animated rollIn">
    <b-form id="journeyform" @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Título:"
        label-for="titulo"
        description="Digite um título para o jogo"
      >
        <b-form-input
          id="titulo"
          v-model="journey.title"
          type="text"
          required
          placeholder="Digite o título"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Descrição:"
        label-for="descricao"
        description="Digite uma apresentação do jogo"
      >
        <div class="my-1">
          <vue-editor
            :customModules="customModulesForEditor"
            :editorOptions="editorSettings"
            v-model="journey.description"
          />
        </div>
      </b-form-group>
      <b-form-group
        id="input-group-3"
        label="Imagem"
        label-for="imagem"
        description="Escolha imagem de fundo do jogo"
      >
        <b-form-file
          id="imagem"
          form="journeyform"
          v-model="files"
          :state="Boolean(files)"
          @change="onFileChange"
          accept="image/jpeg, image/png"
          placeholder="Escolha o arquivo ou arraste aqui..."
          drop-placeholder="Arraste o arquivo aqui..."
          plain
        ></b-form-file>
        <!-- <div class="mt-3">imagem: {{ files ? files.name : '' }}</div> -->
        <img v-if="changeImage" :src="imageData" class="center p-4 img-responsive" width="200px;" />
        <img v-if="!changeImage" :src="image" class="center p-4 img-responsive" width="200px;" />
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="Área:"
        label-for="area"
        description="Escolha a área de conhecimento relacionada ao jogo"
      >
        <b-form-select id="input-3" v-model="journey.area_id" :options="areasToSelect" required></b-form-select>
        <!-- <pre class="m-0">{{ journey.area_id }}</pre> -->
      </b-form-group>

      <b-form-group id="input-group-5">
        <b-form-checkbox v-model="journey.publish" value="1" unchecked-value="0" switch>Publicar</b-form-checkbox>
      </b-form-group>

      <b-button type="submit" variant="primary">Enviar</b-button>
      <b-button type="reset" variant="warning">Cancelar</b-button>
    </b-form>
    <!-- <b-card class="mt-3" header="Dados do Formulário">
      <pre class="m-0">{{ journey }}</pre>
    </b-card>-->
  </div>
</template>

<script>
import Vue from "vue";
import { FormFilePlugin } from "bootstrap-vue";
import { VueEditor } from "vue2-editor";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from 'quill-image-resize-vue';
import { mapState, mapActions } from "vuex";
Vue.use(FormFilePlugin);

export default {
  props: {
    update: {
      require: false,
      type: Boolean,
      default: false
    },
    id: {
      require: false,
      type: Number,
      default: 0
    }
  },
  components: {
    VueEditor
  },
  data() {
    return {
      journey: {
        id: 0,
        title: "",
        description: "",
        imagePath: "",
        area_id: -1,
        publish: 0
      },
      imageData: "",
      content: "",
      changeImage: !this.update,
      files: null,
      areasToSelect: [],
      show: true,
      customModulesForEditor: [
        { alias: "imageDrop", module: ImageDrop },
        { alias: "imageResize", module: ImageResize }
      ],
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      }
    };
  },
  created: function() {},
  computed: {
    ...mapState({
      areas: state => state.areas.areas
    }),
    image() {
      return "/storage/" + this.journey.imagePath;
    }
  },
  mounted: function() {
    // this.$store.dispatch("fetchareas");
    // console.log("fetch areas");
    for (let i = 0; i < this.areas.length; i++)
      this.areasToSelect.push({
        value: this.areas[i].id,
        text: this.areas[i].title
      });
    if (this.update) {
      this.journey = this.$store.getters.getJourney(this.$route.params.id);
    }
    console.log("JourneyForm mounted");
  },
  methods: {
    onFileChange(event) {
      console.log('Event change:', event);
      console.log('Files:', event.target.files);
      this.files = event.target.files[0];
      console.log('Arquivo atribuído:', this.files);
      this.createImage(this.files);
      this.changeImage = true;
    },
    
    createImage(file) {
      let reader = new FileReader();
      let vm = this;
      reader.onload = e => {
        vm.imageData = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    async onSubmit(evt) {
      evt.preventDefault();
      console.log('Arquivo selecionado:', this.files); // Debug 1
      
      if (!this.update && !this.files) { 
        console.log('Nenhum arquivo selecionado');// Debug 2
        this.$snotify.error('A escolha da IMAGEM é obrigatória', 'Erro');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.journey.title);
      formData.append('description', this.journey.description);
      formData.append('area_id', this.journey.area_id);
      formData.append('publish', this.journey.publish ? '1' : '0');
      
      if (this.files) {
        console.log('Arquivo anexado:', this.files[0]); // Debug 3
        formData.append('imageData', this.files);
      }

      try {
        console.log('Enviando dados...'); // Debug 4
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        let response;
        if (this.update) {
          console.log('Modo atualização'); // Debug 5
          formData.append('id', this.journey.id);
          response = await this.$store.dispatch("updateJourney", formData);
        } else {
          console.log('Modo criação'); // Debug 6
          response = await this.$store.dispatch("addJourney", formData);
        }

        console.log('Resposta recebida:', response); // Debug 7
        if (response.data.id) {
          this.$router.push({
            name: "DrawGame",
            params: {
              id: response.data.id,
              title: response.data.title,
              image: response.data.imagePath
            }
          });
        }
      } catch (error) {
        console.error('Erro no submit:', error.response); // Debug 8
        this.$snotify.error(
          error.response?.data?.message || 'Erro ao salvar jornada', 
          "Erro"
        );
      }
    },
    
    onReset(evt) {
      this.$router.push({ name: "JourneyList" });
    }
  }
};
</script>
