<template>
  <div id="list-instructions">
    <b-button v-b-toggle.sidebar-1>Instruções</b-button>
    <b-sidebar id="sidebar-1" title="Listagem de jogos" backdrop shadow>
      <div class="px-3 py-2">
        <p>
          Essa é a tela que apresenta a lista de jogos cadastrados e publicados
          pelos usuários do Tales Ludos.
          <br />As opcões são:
        </p>
        <b-table striped hover :fields="fields" :items="items">
          <template v-slot:cell(icon)="data">
            <b-icon :icon="data.item.icon"></b-icon>
          </template>
          <template v-slot:cell(description)="data">
            <span v-html="data.item.description"></span>
          </template>
        </b-table>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { BootstrapVue, IconsPlugin, BIcon } from "bootstrap-vue";

export default {
  data() {
    return {
      fields: [
        {
          key: "icon",
          label: "Icone"
        },
        {
          key: "description",
          label: "Descrição"
        }
      ],
      items: [
        {
          icon: "eye",
          description:
            "<h5>Mostrar destalhes</h5> Essa opção permite mostrar detalhes do jogo cadastrado"
        },
        {
          icon: "eye-slash",
          description:
            "<h5>Esconder detalhes</h5> Essa opção permite esconder detalhes do jogo cadastrado"
        },
        {
          icon: "controller",
          description:
            "<h5>Jogar</h5> Clique nessa opção para jogar o jogo cadastrado. Será aberta uma " +
            "nova aba no navegador onde o usuário poderá experimentar o jogo cadastrado."
        },
        {
          icon: "cloud-download",
          description:
            "<h5>Baixar jogo</h5> Esta opção serve para que o usuário possa baixar o jogo cadastrado"
        }
      ]
    };
  }
};
</script>
