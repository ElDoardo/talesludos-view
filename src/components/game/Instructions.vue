<template>
  <div id="instructions">
    <b-button @click="showModal">Instruções</b-button>
    <b-modal v-model="modalShow" title="Como criar o jogo" size="xl" class="text-center" hide-footer>
      <div class="px-3 py-2">
        <h4>Menu</h4>
        <p>Passe o mouse sobre os ícones para ver o que cada um faz!</p>
        <b-button-group>
          <b-button  variant="primary" style="width: 50px" class="mx-0" 
            v-b-popover.hover="'Ao clicar neste botão, você poderá adicionar uma nova marca na imagem escolhida.'">
            <b-icon icon="plus-circle"></b-icon>
          </b-button>
          <b-button variant="primary" style="width: 50px" class="mx-0"
            v-b-popover.hover="'Ao selecionar essa opção, você poderá clicar em uma marca para editar a cena e o desafio correspondente.'">
            <b-icon icon="puzzle"></b-icon>
          </b-button>
          <b-button variant="primary" style="width: 200px; font-size: small;" class="mx-0"
            v-b-popover.hover="'Ao clicar neste botão, você poderá ver todos os desafios criados e reposiciona-los.'">
            Ver todos os desafios
          </b-button>
          <b-button variant="primary" style="width: 50px" class="mx-0"
            v-b-popover.hover="'Este botão aparece se você estiver usando um dispositivo móvel. Ao clicar nele, você poderá mover a marca.'">
            <b-icon icon="arrows-move"></b-icon>
          </b-button>
        </b-button-group>
        <br />
        <h4>Adicionar marca</h4>
        <p>
          Para adicionar uma nova marca, clique no botão <b-icon icon="plus-circle"></b-icon> e depois clique na imagem onde deseja adicionar a marca. 
          Sua imagem deve ficar parecida com o exemplo abaixo:
        </p>
        <b-img src="/images/instructions/create-mark.gif" alt="Adicionar marca" fluid center class="my-2"></b-img>
        <h4>Editar marca</h4>
        <p>
          Para editar uma marca, clique no botão <b-icon icon="puzzle"></b-icon> e depois clique na marca que deseja editar. A cor da marca ficará roxa para indicar que ela está selecionada.
        </p>
        <b-img src="/images/instructions/edit-mark.gif" alt="Editar marca" fluid center class="my-2"></b-img>
        <p>
          Após selecionar a marca, você poderá editar a cena e o desafio correspondente. O primeiro editor é para a cena, que deve conter o conteúdo relacionado ao desafio.
        </p>
        <p>
          Em seguida, você deve selecionar o tipo de desafio que deseja criar. Atualmente, temos 5 tipos de desafios:          
        </p>
        <p>
          <strong>Múltipla escolha: </strong> No editor, escreva a pergunta. Para adicionar uma nova opção de resposta, clique em "<b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Opção"
          e para remover uma opção, clique em <b-icon icon="trash" variant="primary"></b-icon>. Marque a opção correta clicando no checkbox ao lado da opção.
        </p>
        <p>
          <strong>Verdadeiro ou falso: </strong> No editor, escreva a pergunta e, se a resposta for verdadeira, clique no checkbox abaixo da pergunta. Caso contrário, deixe o checkbox desmarcado.
        </p>
        <p>
          <strong>Preenchimento de Lacuna: </strong> No editor, escreva a pergunta e adicione as lacunas que devem ser preenchidas colocando-as entre cifrões. Por exemplo, se a pergunta for "O Brasil é um país $país$ e sua capital é $capital$.", as lacunas são "país" e "capital".
        </p>
        <p>
          <strong>Associação: </strong> No editor, escreva a pergunta e adicione as associações. No primeiro campo, escreva o item que deve ser associado e, no segundo campo, escreva o item associado. Para adicionar uma nova associação, clique em "<b-icon icon="plus-circle-fill" variant="primary"></b-icon> Adicionar Associação"
          e para remover uma associação, clique em <b-icon icon="trash" variant="primary"></b-icon>.
        </p>
        <p>
          <strong>Resposta curta: </strong> No editor, escreva a pergunta e a resposta correta. A resposta correta deve ser escrita no campo "Resposta".
        </p>
        <p>
          Após editar a cena e o desafio, clique em "Finalizar edição" para salvar as alterações. Caso deseje apagar a marca, clique em "Excluir".
        </p>
        <br />
        <h4>Ver todos os desafios</h4>
        <p>
          Para ver todos os desafios criados, clique no botão "Ver todos os desafios". Você verá uma lista com todos os desafios criados e poderá reposicioná-los cliando em <b-icon icon="chevron-down"></b-icon>
          ou <b-icon icon="chevron-up"></b-icon>. Ao clicar em um desafio, você verá o conteúdo da cena e do desafio correspondente.
        </p>
        <br />
        <h4>Mover marca</h4>
        <div v-if="isMobile">
          <p>
            Se você estiver usando um dispositivo móvel, ao clicar no botão <b-icon icon="arrows-move"></b-icon>, você poderá mover a marca para outra posição na imagem. Basta clicar
            na marca e depois clicar na nova posição.
          </p>
          <b-img src="/images/instructions/move-mark-mobile.gif" alt="Mover marca" fluid center class="my-2"></b-img>
        </div>
        <div v-else>
          <p>
            Para mover uma marca, clique na marca e arraste-a para a nova posição. A marca deve ficar parecida com o exemplo abaixo:
          </p>
          <b-img src="/images/instructions/move-mark.gif" alt="Mover marca" fluid center class="my-2"></b-img>
        </div>

      </div>
    </b-modal>
  </div>
</template>

<script>
import { BootstrapVue, IconsPlugin, BIcon } from "bootstrap-vue";

export default {
  data() {
    return {
      modalShow: false,
      isMobile: false
    };
  },
  mounted() {
    this.isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
  methods: {
    showModal() {
      this.modalShow = true;
    }
  }
};
</script>
