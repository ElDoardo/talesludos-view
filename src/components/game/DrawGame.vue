<template>
  <div id="drawgame" name="drawgame" class="animated tada">
    <h2>{{ title }}</h2>

    <p>
      Com a imagem de fundo escolhida, defina a dinâmica do jogo. Clique no botão
      <strong>instruções</strong> para
      uma explicação detalhada de cada opção do menu abaixo.
    </p>

    <instructions />
    <hr />

    <b-button-group>
      <!-- adiconar marca -->
      <b-button :pressed="mode == 1" variant="primary" style="width: 50px" class="mx-0" @click.prevent="markEvent">
        <b-icon icon="plus-circle"></b-icon>
      </b-button>
      <!-- abrir desafio -->
      <b-button :pressed="mode == 2" variant="primary" style="width: 50px" class="mx-0"
        @click.prevent="sceneChallengeEvent">
        <b-icon icon="puzzle"></b-icon>
      </b-button>
      <!-- ver todos os desafios -->
      <b-button :pressed="mode == 3" :disabled="form.challenges.length == 0" variant="primary" style="width: 200px; font-size: small;" class="mx-0" @click.prevent="showChallenges">
        Ver todos os desafios
      </b-button>
      <!-- se for mobile, exibe o botão de mover -->
      <b-button v-if="isMobile" :pressed="mode == 4" variant="primary" style="width: 50px" class="mx-0"  @click.prevent="moveEvent">
        <b-icon icon="arrows-move"></b-icon>
      </b-button>
    </b-button-group>

    <!-- <pre> {{ image }} </pre> -->

    <!-- Canvas - P5js -->
    <game-canvas :mode="mode" :markedpoint.sync="markedpoint" :marks.sync="form.marks" :links.sync="form.links"
      :image.sync="image" @update-edit="updateEdit" ref="canvas" />

    <!-- Desafios -->
    <div v-if="showAllChallenges">
      <div v-for="(challenge, index) in form.challenges" :key="challenge.id"
        :class="{ 'moving': challenge.id === movingItemId }">
        <div class="reorderable-card mb-3">
          <div class="reorderable-card-title" @click="openChallenge(challenge.id)">
            <b-icon icon="plus-lg"></b-icon>
            <h3>Desafio e cena {{ challenge.id }}</h3>
          </div>
          <div>
            <b-button @click.prevent="moveChallenge('up', challenge.id)" :disabled="index === 0"><b-icon
                icon="chevron-up"></b-icon></b-button>
            <b-button @click.prevent="moveChallenge('down', challenge.id)"
              :disabled="index === form.challenges.length - 1"><b-icon icon="chevron-down"></b-icon></b-button>
          </div>
        </div>
        <div v-if="openChallengesIds.includes(challenge.id)">
            <h4>{{ editTitle(0, challenge.id) }}</h4>
            <vue-editor v-model="sceneContents[index]" :editor-settings="editorSettings"
              :custom-modules="customModulesForEditor" />

            <h3>{{ editTitle(1, challenge.id) }}</h3>
            <!-- verdadeiro ou falso -->
            <vue-editor v-model="challengeContents[index]" :editor-settings="editorSettings"
              :custom-modules="customModulesForEditor" class="my-3" />
            <div v-if="selectQuestionType[index] == 1">
              <div class="my-1" v-show="showcheckbox">
                <b-form-checkbox id="cb-correct" v-model="challengeDetails[index].correct" name="cb-correct">Marque se a afirmativa
                  estiver
                  correta</b-form-checkbox>
              </div>
            </div>
            <!-- múltipla escolha -->
            <div v-else-if="selectQuestionType[index] == 2">
              <div v-for="(option, optionIndex) in challengeDetails[index].options" :key="optionIndex" class="mb-2">
                <div style="display: flex; align-items: center;">
                  <b-form-checkbox v-model="challengeDetails[index].correctOptionIndex" :value="optionIndex"
                    style="margin-right: 10px;"></b-form-checkbox>
                  <input v-model="option.text" type="text" :placeholder="'Escreva a opção aqui'" style="margin-right: 10px;">
                  <a @click="removeOption(optionIndex, index)">
                    <b-icon icon="trash" variant="primary"></b-icon>
                  </a>
                </div>
              </div>
              <a @click="addOption(index)"><b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Opção</a>
            </div>
            <!-- preenchimento de lacuna  -->
            <div v-else-if="selectQuestionType[index] == 3">
                <div class="d-flex justify-content-center">
                  <div class="alert alert-secondary w-75 d-flex align-items-center" role="alert">
                    <b-icon icon="info-circle-fill" class="sm mr-3" variant="primary"></b-icon>
                    <p class="m-0">Para criar um campo de preenchimento de lacuna, coloque a palavra entre cifrões ($). <strong>Por exemplo:</strong>
                      O $céu$ é azul. Dessa forma, o jogador deverá preencher o campo com a palavra "céu".</p>              
                  </div>
                </div>
            </div>
            <!-- associação -->
            <div v-else-if="selectQuestionType[index] == 4">
              <div v-for="(association, associationIndex) in challengeDetails[index].associations" :key="associationIndex" class="mb-2">
                <div style="display: flex; align-items: center;">
                  <input v-model="association.text" type="text" :placeholder="'Escreva a opção aqui'"
                    style="margin-right: 10px;">
                  <b-icon icon="arrow-right" style="margin-right: 10px;"></b-icon>
                  <input v-model="association.associated" type="text" :placeholder="'Escreva a associação aqui'"
                    style="margin-right: 10px;">
                  <a @click="removeAssociation(associationIndex, index)">
                    <b-icon icon="trash" variant="primary"></b-icon>
                  </a>
                </div>
              </div>
              <a @click="addAssociation(index)"><b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Opção</a>
            </div>
            <!-- resposta curta -->
            <div v-else-if="selectQuestionType[index] == 5">
              <div style="display: flex; align-items: center;">
                <p>Resposta</p>
                <input type="text" v-model="challengeDetails[index].answer" placeholder="Escreva a resposta aqui"
                  style="margin-left: 10px;">
              </div>
            </div>

            <div>
              <span v-if="message" class="text-danger">{{ message }}</span>
            </div>

            <button type="button" class="btn btn-primary mt-2" @click.prevent="endEdition(challenge.id)">Finalizar edição</button>
            <button type="button" class="btn btn-secondary mt-2" @click.prevent="deleteMark(challenge.id - 1)">Excluir</button>
          </div>
        
      </div>
      
    </div>

    <!-- Quil Editor -->
    <div>
      <!-- titulo cena e editor cena + titulo desafio e editor desafio -->
      <div>
      <!-- titulo cena e editor cena + titulo desafio e editor desafio -->
      <div v-if="showeditor">
        <h4>{{ editTitle(0, markedpoint + 1) }}</h4>
        <vue-editor v-model="sceneContents[markedpoint]" :editor-settings="editorSettings" :custom-modules="customModulesForEditor" />
        
        <h3>{{ editTitle(1, markedpoint + 1) }}</h3>
        <div>
          <select id="question-type" v-model="currentChallengeType" class="form-control bg-primary text-white w-50">
            <option value="0">Escolha o tipo de pergunta</option>
            <option value="1">Verdadeiro ou falso</option>
            <option value="2">Múltipla escolha</option>
            <option value="3">Preenchimento de lacuna</option>
            <option value="4">Associação</option>
            <option value="5">Resposta curta</option>
          </select>
        </div>
        <!-- verdadeiro ou falso -->
        <div v-if="currentChallengeType == 1">
          <vue-editor v-model="challengeContents[markedpoint]" :editor-settings="editorSettings"
            :custom-modules="customModulesForEditor" class="my-3" />
          <div class="my-1" v-show="showcheckbox">
            <b-form-checkbox id="cb-correct" v-model="challengeDetails[markedpoint].correct" name="cb-correct">Marque se a afirmativa
              estiver
              correta</b-form-checkbox>
          </div>
        </div>
        <!-- múltipla escolha -->
        <div v-else-if="currentChallengeType == 2">
          <vue-editor v-model="challengeContents[markedpoint]" :editor-settings="editorSettings"
            :custom-modules="customModulesForEditor" class="my-3" />
          <div v-for="(option, index) in challengeDetails[markedpoint].options" :key="index" class="mb-2">
            <div style="display: flex; align-items: center;">
              <b-form-checkbox v-model="challengeDetails[markedpoint].correctOptionIndex" :value="index"
                style="margin-right: 10px;"></b-form-checkbox>
              <input v-model="option.text" type="text" :placeholder="'Escreva a opção aqui'" style="margin-right: 10px;">
              <a @click="removeOption(index, markedpoint)">
                <b-icon icon="trash" variant="primary"></b-icon>
              </a>
            </div>
          </div>
          <a @click="addOption(markedpoint)"><b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Opção</a>
        </div>
        <!-- preenchimento de lacuna  -->
        <div v-else-if="currentChallengeType == 3">
          <vue-editor v-model="challengeContents[markedpoint]" :editor-settings="editorSettings"
            :custom-modules="customModulesForEditor" class="my-3" />
            <div class="d-flex justify-content-center">
              <div class="alert alert-secondary w-75 d-flex align-items-center" role="alert">
                <b-icon icon="info-circle-fill" class="sm mr-3" variant="primary"></b-icon>
                <p class="m-0">Para criar um campo de preenchimento de lacuna, coloque a palavra entre cifrões ($). <strong>Por exemplo:</strong>
                  O $céu$ é azul. Dessa forma, o jogador deverá preencher o campo com a palavra "céu".</p>              
              </div>
            </div>
        </div>
        <!-- associação -->
        <div v-else-if="currentChallengeType == 4">
          <vue-editor v-model="challengeContents[markedpoint]" :editor-settings="editorSettings"
            :custom-modules="customModulesForEditor" class="my-3" />
          <div v-for="(association, index) in challengeDetails[markedpoint].associations" :key="index" class="mb-2">
            <div style="display: flex; align-items: center;">
              <input v-model="association.text" type="text" :placeholder="'Escreva a opção aqui'"
                style="margin-right: 10px;">
              <b-icon icon="arrow-right" style="margin-right: 10px;"></b-icon>
              <input v-model="association.associated" type="text" :placeholder="'Escreva a associação aqui'"
                style="margin-right: 10px;">
              <a @click="removeAssociation(index, markedpoint)">
                <b-icon icon="trash" variant="primary"></b-icon>
              </a>
            </div>
          </div>
          <a @click="addAssociation(markedpoint)"><b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Opção</a>
        </div>
        <!-- resposta curta -->
        <div v-else-if="currentChallengeType == 5">
          <vue-editor v-model="challengeContents[markedpoint]" :editor-settings="editorSettings"
            :custom-modules="customModulesForEditor" class="my-3" />
          <div style="display: flex; align-items: center;">
            <p>Resposta</p>
            <input type="text" v-model="challengeDetails[markedpoint].answer" placeholder="Escreva a resposta aqui"
              style="margin-left: 10px;">
          </div>
        </div>

        <span v-if="message" class="text-danger">{{ message }}</span>
        
        <div>
          <button type="button" class="btn btn-primary mt-2" @click.prevent="endEdition(markedpoint)">Finalizar edição</button>
          <button type="button" class="btn btn-secondary mt-2" @click.prevent="deleteMark(markedpoint)">Excluir</button>
        </div>
      </div>
    </div>
    </div>

    <form id="formUpdate" action="route" @submit.prevent="onSubmit" method="post" v-if="show">
      <div>
        <button type="submit" class="btn btn-primary">Gravar jogo</button>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import {
  BootstrapVue,
  IconsPlugin,
  BIcon,
  JumbotronPlugin,
  LayoutPlugin
} from "bootstrap-vue";
import GameCanvas from "./GameCanvas.vue";
import instructions from "./Instructions.vue";
import { VueEditor } from "vue2-editor";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from 'quill-image-resize-vue';
import Snotify from "vue-snotify";

import { mapState, mapActions } from "vuex";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(JumbotronPlugin);

export default {
  name: "DrawGame",
  props: ["title", "image"],
  components: {
    BootstrapVue,
    IconsPlugin,
    GameCanvas,
    VueEditor,
    BIcon,
    instructions,
    JumbotronPlugin,
    LayoutPlugin,
    Snotify
  },
  data() {
    return {
      show: false,
      mode: 1,
      selectQuestionType: [], // armazena o tipo de pergunta selecionado para cada desafio
      currentChallengeType: 0, // armazena o tipo de pergunta selecionado para o desafio atual
      currentChallengeId: 0, // armazena o ID do desafio atual
      markedpoint: -1,
      openChallenges: {}, // armazena os desafios abertos
      showeditor: false,
      showcheckbox: false,
      debug: false,
      showAllChallenges: false, // mostra todos os desafios
      openChallengesIds: [], // armazena os IDs dos desafios abertos
      challengeContents: [], // armazena o conteúdo dos desafios
      sceneContents: [], // armazena o conteúdo das cenas
      movingItemId: null, // armazena o ID do desafio sendo movido
      isMobile: false, // verifica se o dispositivo é mobile
      customModulesForEditor: [
        { alias: "imageDrop", module: ImageDrop },
        { alias: "imageResize", module: ImageResize }
      ],
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      },
      challengeDetails: { // armazena os detalhes dos desafios
        correct: [],
        options: [],
        correctOptionIndex: [],
        answer: [],
        associations: []
      },
      isFinalized: false, // verifica se a edição do desafio foi finalizada
      message: "",
      errors: []
    };
  },
  created: function () {
    console.log("DrawGame created");
    // console.log("Title = ", this.title);
    // console.log("image = ", this.image);
    // console.log(this.form);
  },
  computed: {
    // state.games.form = state form in games module vuex
    ...mapState({ form: state => state.games.form }),
    backImage: function () {
      return "/storage/" + this.image;
    },
    idMarked: function () {
      return this.form.marks.coords[this.markedpoint].id;
    }
  },
  mounted: function () {
    // corresponding this.$store.dispatch('editGame', this.$route.params.id)
    this.editGame(this.$route.params.id);
    this.show = false;
    this.$nextTick(() => {
      this.show = true;
    });
    this.checkMobile();
  },
  watch: {},
  methods: {
    // mapping this.editGame to this.$store.dispatch('editGame')
    // mapping this.updateGame to this.$store.dispatch('updateGame')
    ...mapActions(["editGame", "updateGame"]),
    validId: function (id) {
      return this.form.marks.coords.findIndex(obj => obj.id == id) != -1;
    },

    checkMobile() { // verifica se o dispositivo é mobile
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      console.log("isMobile = ", this.isMobile);
    },

    editTitle(value, id) { // retorna o título da cena ou desafio
      if (this.id != -1) {
        if (value == 0) return "Descrição da cena " + id;
        else if (value == 1)
          if (this.currentChallengeType == 1) return "Desafio " + id + ": verdadeiro ou falso?";
          else if (this.currentChallengeType == 2) return "Desafio " + id + ": múltipla escolha";
          else if (this.currentChallengeType == 3) return "Desafio " + id + ": preenchimento de lacuna";
          else if (this.currentChallengeType == 4) return "Desafio " + id + ": associação";
          else if (this.currentChallengeType == 5) return "Desafio " + id + ": resposta curta";
          else return "Desafio " + id;
      } else {
        return "";
      }
    },

    markEvent() {
      this.mode = 1;
      this.markedpoint = -1;
      this.showAllChallenges = false;
      this.closeChallenges();
    },

    sceneChallengeEvent() {
      this.mode = 2;
      this.markedpoint = -1;
    },

    moveEvent() {
      this.mode = 3;
      this.markedpoint = -1;
      this.showAllChallenges = false;
      this.closeChallenges();
    },

    moveEvent() {
      this.mode = 4;
      this.markedpoint = -1;
      this.showAllChallenges = false;
      this.closeChallenges();
    },

    addOption(challengeIndex) { // adiciona uma nova opção ao desafio
      this.challengeDetails[challengeIndex].options.push({ text: "" });
      this.$forceUpdate(); 
    },

    removeOption(optionIndex, challengeIndex) { // remove uma opção do desafio
      if (this.challengeDetails[challengeIndex] && this.challengeDetails[challengeIndex].options) {
        this.challengeDetails[challengeIndex].options.splice(optionIndex, 1);
        this.$forceUpdate(); 
      }
    },

    addAssociation(challengeIndex) { // adiciona uma nova associação ao desafio
      this.challengeDetails[challengeIndex].associations.push({ text: "" });
      this.$forceUpdate(); 
    },

    removeAssociation(associationIndex, challengeIndex) { // remove uma associação do desafio
      if (this.challengeDetails[challengeIndex] && this.challengeDetails[challengeIndex].associations) {
        this.challengeDetails[challengeIndex].associations.splice(associationIndex, 1);
        this.$forceUpdate(); 
      }
    },

    openChallenge(id) { // abre um desafio
      const index = this.openChallengesIds.indexOf(id);
      if (index > -1) { // fecha o desafio se ele já estiver aberto
        this.openChallengesIds.splice(index, 1); 
        this.loadChallenge(-1); 
        this.loadScene(-1); 
      } else {
        this.openChallengesIds.push(id); // adiciona o desafio à lista de desafios abertos
        const challengeIndex = this.form.challenges.findIndex(challenge => challenge.id === id);
        const sceneIndex = this.form.scenes.findIndex(scene => scene.id === id);
        this.loadChallenge(challengeIndex); // carrega o desafio
        this.loadScene(sceneIndex); // carrega a cena
      }
    },

    moveChallenge(direction, id) { // move um desafio para cima ou para baixo
      let index = this.form.challenges.findIndex(x => x.id === id);
      if (index === -1) return; // verifica se o desafio existe
           
      if ((direction === 'up' && index >= 0) || (direction === 'down' && index <= this.form.challenges.length - 1)) { // verifica se o desafio pode ser movido
        // determina a nova posição com base na direção
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        this.movingItemId = direction === 'up' ? id - 1 : id + 1;
          
        this.$set(this.openChallenges, id, false); // fecha o desafio
        this.$set(this.openChallenges, index, false); // fecha o desafio
        
        // troca os desafios
        [this.form.challenges[index], this.form.challenges[newIndex]] = [this.form.challenges[newIndex], this.form.challenges[index]];

        // mantenha o desafio editando se ele foi movido
        if (this.markedpoint === index) {
          this.markedpoint = newIndex;
        } else if (this.markedpoint === newIndex) {
          this.markedpoint = index;
        }

        // troca as cenas correspondentes, se necessário
        if (this.form.scenes[index] && this.form.scenes[newIndex]) {
          [this.form.scenes[index], this.form.scenes[newIndex]] = [this.form.scenes[newIndex], this.form.scenes[index]];
        }

        // atualiza os IDs dos desafios e cenas para refletir a nova ordem, se necessário
        this.form.challenges.forEach((challenge, idx) => {
          challenge.id = idx + 1; // ajuste conforme a lógica de IDs do seu app
        });
        this.form.scenes.forEach((scene, idx) => {
          scene.id = idx + 1; // ajuste conforme a lógica de IDs do seu app
        });

        // recarrega a cena e o desafio se um deles estiver aberto atualmente
        if (this.showeditor) {
          let currentOpenIndex = this.markedpoint === this.form.challenges[index].id ? newIndex : this.markedpoint === this.form.challenges[newIndex].id ? index : null;
          if (currentOpenIndex !== null)
            this.markedpoint = this.form.challenges[currentOpenIndex].id; // Atualiza o markedpoint para a nova posição
        }

        this.showeditor = false;
        this.showcheckbox = false;

        if (!this.openChallengesIds.includes(this.movingItemId)) {
          // substitui o id do desafio movido pelo novo id na lista de desafios abertos
          const movingIndex = this.openChallengesIds.indexOf(id);
          this.openChallengesIds.splice(movingIndex, 1, this.movingItemId);
        }
        let openChallengesIds = this.openChallengesIds;

        this.closeChallenges(); // fecha todos os desafios

        openChallengesIds.forEach((id, index) => {
          this.openChallenge(id); // reabre os desafios
        });
      }
    },

    showChallenges() { // exibe todos os desafios
      this.closeChallenges(); // fecha todos os desafios
      this.mode = 3;
      this.markedpoint = -1;
      this.showAllChallenges = !this.showAllChallenges;
      this.isChallengeOpen = true;
    },

    closeChallenges() { // fecha todos os desafios
      this.loadScene(-1);
      this.loadChallenge(-1);
      this.showeditor = false;
      this.showcheckbox = false;
      this.openChallengesIds = [];
    },

    updateEdit(value) {
      this.message = ""; // limpa a mensagem de erro
      this.markedpoint = value;
      if (this.markedpoint != -1 && this.mode == 2 || this.mode == 3) {
        let challenge = this.form.challenges.findIndex(x => x.id === this.idMarked);
        let scene = this.form.scenes.findIndex(x => x.id === this.idMarked);
        this.loadScene(scene);
        this.loadChallenge(challenge);
        this.showeditor = true;
        this.showAllChallenges = false;
      } else {
        this.showeditor = false;
        this.showcheckbox = false;
      }
    },

    ensureChallengeDetailsInitialized(i) { // inicializa os detalhes do desafio
      if (typeof this.challengeDetails[i] === 'undefined') {
        this.$set(this.challengeDetails, i, {
          correct: false,
          options: [],
          correctOptionIndex: -1,
          answer: '',
          associations: [],
        });
      }
    },

    loadScene(i) { // carrega a cena
      if (i != -1) {
        this.sceneContents[i] = this.form.scenes[i].content;
      } else {
        this.sceneContents[i] = "";
      }
    },

    loadChallenge(i) { // carrega o desafio
      this.ensureChallengeDetailsInitialized(i);
      if (i != -1) { // carrega o desafio
        this.challengeContents[i] = this.form.challenges[i].content; // carrega o conteúdo do desafio
        this.currentChallengeType = this.form.challenges[i].type || 0; // carrega o tipo de desafio
        this.selectQuestionType[i] = this.currentChallengeType; // carrega o tipo de desafio
        this.isChallengeOpen = false; // verifica se o desafio está aberto

        this.challengeDetails[i].options = this.form.challenges[i].options || [{ option: "" }]; // carrega as opções do desafio
        this.challengeDetails[i].correctOptionIndex = this.form.challenges[i].correctOptionIndex ?? -1; // carrega a opção correta do desafio
        this.challengeDetails[i].answer = this.form.challenges[i].answer || ""; // carrega a resposta do desafio    
        this.challengeDetails[i].associations = this.form.challenges[i].associations || [{ text: "", associated: "" }]; // carrega as associações do desafio
        this.challengeDetails[i].correct = this.form.challenges[i].correct || false; // carrega se a resposta é verdadeira ou falsa
      } else { // limpa o desafio
        this.challengeContents[this.markedpoint] = "";
        this.selectQuestionType[this.markedpoint] = 0;
        this.currentChallengeType = 0;
        this.challengeDetails[this.markedpoint] = {
          correct: false,
          options: [{ option: "" }],
          correctOptionIndex: -1,
          answer: "",
          associations: [{ text: "", associated: "" }]
        };
      }
      this.showcheckbox = true;
    },

    deleteMark(id) { // deleta uma marca
      if (id != -1) {
        // remove a marca
        this.form.marks.coords.splice(id, 1);

        let i = 0;
        while (i < this.form.links.length) {
          if (this.form.links[i].i == id || this.form.links[i].j == id)
            this.form.links[i].removed = true;
          if (this.form.links[i].i > id) this.form.links[i].i--;
          if (this.form.links[i].j > id) this.form.links[i].j--;
          i++;
        }

        // remove os conteúdos associados à marca deletada dos arrays de cenas e desafios
        this.sceneContents.splice(id, 1);
        this.challengeContents.splice(id, 1);
        this.selectQuestionType.splice(id, 1);
        Vue.delete(this.challengeDetails, id); 

        // remove as cenas e desafios associados à marca
        this.form.scenes = this.form.scenes.filter(scene => scene.id - 1 !== id);
        this.form.challenges = this.form.challenges.filter(challenge => challenge.id - 1 !== id);


        // reconecta as marcas
        this.form.links = []; // limpa os links existentes

        // cria novos links entre as marcas sequencialmente
        for (let i = 0; i < this.form.marks.coords.length - 1; i++) {
          this.form.links.push({
            i: i,
            j: i + 1,
            removed: false
          });
        }

        // atualiza os IDs das cenas e desafios de forma a preservar o conteúdo associado
        let updatedScenes = [];
        let updatedChallenges = [];
        this.form.scenes.forEach(scene => {
          if (scene.id > id) scene.id--;
          updatedScenes.push(scene);
        });
        this.form.challenges.forEach(challenge => {
          if (challenge.id > id) challenge.id--;
          updatedChallenges.push(challenge);
        });

        // atualiza as cenas e desafios no formulário
        this.form.scenes = updatedScenes;
        this.form.challenges = updatedChallenges;

        // atualiza os IDs das marcas
        this.form.marks.coords.forEach((mark, index) => {
          mark.id = index + 1;
        });
        this.form.marks.nextMark = this.form.marks.coords.length + 1;

        this.showeditor = false;
        id = -1;
      }
    },

    isChallengeComplete(i) { // verifica se o desafio foi finalizado
      this.isFinalized = true;
      
      if (this.sceneContents[i] == undefined || this.sceneContents[i] == "") { // verifica se a cena está vazia
        this.errors.push("a cena não pode estar vazia");
        this.isFinalized = false;
      } 

      if (this.challengeContents[i] == undefined || this.challengeContents[i] == "") { // verifica se o desafio está vazio
        this.errors.push("o desafio não pode estar vazio");
        this.isFinalized = false;
      }

      if (this.currentChallengeType == 0 || this.currentChallengeType == undefined) { // verifica se o tipo de desafio foi selecionado
        this.errors.push("o tipo de desafio não foi selecionado");
        this.isFinalized = false;
      } else {
        if (this.currentChallengeType == 2) {
          if (this.challengeDetails[i].correctOptionIndex == -1) { // verifica se a opção correta foi selecionada
            this.errors.push("a opção correta não foi selecionada");
            this.isFinalized = false;
          }
          
          if (this.challengeDetails[i].options.length < 2) { // verifica se há ao menos duas opções
            this.errors.push("é necessário ao menos duas opções");
            this.isFinalized = false;
          }
  
          if (this.challengeDetails[i].options.some(option => option.text === "")) { // verifica se todas as opções foram preenchidas
            this.errors.push("todas as opções devem ser preenchidas");
            this.isFinalized = false;
          }
        } else if (this.currentChallengeType == 3) {
          if (!this.challengeContents[i].includes("$")) { // verifica se a lacuna foi inserida
            this.errors.push("o texto deve conter o caractere $ para indicar a lacuna");
            this.isFinalized = false;
          }

          if (this.challengeContents[i].split("$").length < 3) { // verifica se há ao menos uma lacuna
            this.errors.push("é necessário ao menos uma lacuna");
            this.isFinalized = false;
          }

        } else if (this.currentChallengeType == 4) {
          if (!this.challengeDetails[i].associations.length > 0) { // verifica se há ao menos uma associação
            this.errors.push("é necessário ao menos uma associação");
            this.isFinalized = false;
          }
          if (this.challengeDetails[i].associations.every(association => association.text === "" && association.associated === "")) { // verifica se todas as associações foram preenchidas
            this.errors.push("todas as associações devem ser preenchidas");
            this.isFinalized = false;
          }
        } else if (this.currentChallengeType == 5) {
          if (!this.challengeDetails[i].answer.length > 0) { // verifica se a resposta foi inserida
            this.errors.push("a resposta não pode estar vazia");
            this.isFinalized = false;
          }
        }
      }
    },

    endEdition(id) {
      if (this.mode == 3)
        this.currentChallengeId = id;
      else
        this.currentChallengeId = this.idMarked;

      this.message = ""; // limpa a mensagem de erro

      this.isChallengeComplete(this.currentChallengeId - 1); // verifica se o desafio foi finalizado

      if (!this.isFinalized) {
        this.message = this.errors.join(", "); // exibe a mensagem de erro
        this.errors = [];
        return;
      }

      // salva o desafio e a cena
      this.saveScene();
      this.saveChallenge();
      
      if (this.mode == 2) {
        this.showeditor = false;
        this.markedpoint = -1;
      }
    },

    saveChallenge() { // salva o desafio
      let challengeIndex = this.form.challenges.findIndex(x => x.id === this.currentChallengeId);
      if (challengeIndex != -1) {
        this.form.challenges[challengeIndex].content = this.challengeContents[challengeIndex]; // salva o conteúdo do desafio
        this.form.challenges[challengeIndex].type = this.currentChallengeType; // salva o tipo de desafio

        if (this.currentChallengeType == 2) {
          this.form.challenges[challengeIndex].options = this.challengeDetails[challengeIndex].options; // salva as opções do desafio
          this.form.challenges[challengeIndex].correctOptionIndex = this.challengeDetails[challengeIndex].correctOptionIndex; // salva a opção correta do desafio
        } else if (this.currentChallengeType == 5) {
          this.form.challenges[challengeIndex].answer = this.challengeDetails[challengeIndex].answer; // salva a resposta do desafio
        } else if (this.currentChallengeType == 4) {
          this.form.challenges[challengeIndex].associations = this.challengeDetails[challengeIndex].associations; // salva as associações do desafio
        } else if (this.currentChallengeType == 1) {
          this.form.challenges[challengeIndex].correct = this.challengeDetails[challengeIndex].correct; // salva se a resposta é verdadeira ou falsa
        }
      } else {
        this.form.challenges.push({ // adiciona um novo desafio
          id: this.currentChallengeId,
          content: this.challengeContents[this.currentChallengeId - 1],
          correct: this.challengeDetails[this.currentChallengeId - 1].correct,
          type: this.currentChallengeType,
          options: this.challengeDetails[this.currentChallengeId - 1].options,
          correctOptionIndex: this.challengeDetails[this.currentChallengeId - 1].correctOptionIndex,
          answer: this.challengeDetails[this.currentChallengeId - 1].answer,
          associations: this.challengeDetails[this.currentChallengeId - 1].associations
        });
      }
    },

    saveScene() { // salva a cena
      let sceneIndex = this.form.scenes.findIndex(x => x.id === this.currentChallengeId);
      if (sceneIndex != -1) {
        this.form.scenes[sceneIndex].content = this.sceneContents[sceneIndex]; // salva o conteúdo da cena
      } else {
        this.form.scenes.push({ // adiciona uma nova cena
          id: this.currentChallengeId,
          content: this.sceneContents[this.currentChallengeId - 1]
        });
      }
    },
    onSubmit: function () {
      let self = this;

      if (this.form.challenges.length != this.form.marks.coords.length) { // verifica se cada marca tem um desafio associado
        self.$snotify.error("Cada marca deve ter um desafio associado", "Erro");
        return;
      }

      // filter data before to submit
      this.form.links = this.form.links.filter(obj => !obj.removed);
      this.form.scenes = this.form.scenes.filter(obj => this.validId(obj.id));
      this.form.challenges = this.form.challenges.filter(obj =>
        this.validId(obj.id)
      );
      

      // corresponding this.$store.dispatch('updateGame', this.$route.params.id)
      this.updateGame(this.$route.params.id)
        .then(response => {
          if (response.status == "200") {
            self.$snotify.success("Gravado com sucesso", "OK");
            self.$router.push({ name: "JourneyList", params: { all: false } });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>