<template>
  <div id="history" class="animated zoomIn">
    <div>
      <div>
        <b-img src="./images/banner.png" fluid alt="Photo by Waldemar Brandt on Unsplash"></b-img>
      </div>
      <b-button v-b-toggle.collapse-1 variant="primary">Histórico</b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card-group columns>
          <b-card
            img-src="/images/tela1.png"
            img-alt="Versão inicial"
            img-bottom
            class="mb-3"
            title="Primeira versão"
          >
            <b-card-text>
              Na versão inicial, pensamos na definição do jogo numa única tela. À esquerda estavam as
              opções de inclusão de cenas e desafios e à direita a ferramenta de desenho do roteiro do
              jogo. A cada cena criada, uma marca correspondente era incluída na tela de desenho. E para
              cada cena criada, o autor ainda podia definir os desafios. Esta versão foi desenvolvida
              pelos estudantes bolsistas do curso de Ciência da Computação: Henrique dos Santos Wisniewski,
              Filipe Parisoto Ribeiro, Denner Azevedo Rocha e Henrique Alves de Oliveira com a supervisão
              do Analista Luis Philipe Garroni Andrade e a coordenação do servidor Marcos de Abreu Nery e
              dos professores Luiz Eduardo da Silva e Gabriel Gerber Hornink.
            </b-card-text>
          </b-card>
          <b-card
            img-src="/images/sequencia.png"
            img-alt="Segunda versão"
            img-top
            class="mb-3"
            title="Segunda versão"
          >
            <b-card-text>
              Nesta versão, o autor do jogo deve registrar-se no ambiente para iniciar a construção dos
              seus jogos. Assim que o usuário cria login e senha, é apresentado o seu repositório de jogos. Nessa
              tela o usuário pode criar um novo jogo, editar um jogo já cadastrado, mostrar o jogo
              (com a possibilidade de exclusão de um jogo da lista) ou então fazer um download de
              um jogo da lista de jogos. Na tela de criação ou edição do
              jogo o usuário deve informar o título, um descrição a a imagem de fundo do jogo.
              Na próxima etapa o autor tem que incluir a dinâmica do jogo, ou seja, marcar locais na imagem
              de fundo e a definir a sequência didática de conteúdos e atividades desse percurso.
            </b-card-text>
          </b-card>
          <b-card
            img-src="/images/jogo.png"
            img-alt="Tela de edição"
            img-bottom
            class="mb-3"
            title="Tela de Edição e o Jogo Gerado"
          >
            <b-card-text>
              O resultado final é um arquivo .zip com a imagem e a dinâmica do jogo,
              conforme projetado. Os lugares marcados e a sequência didática é acompanhada de animações que
              podem ser configuradas. O arquivo pode ser descompactado e o jogo pode ser executado sem
              necessidade de instalação no próprio navegador com a abertura do arquivo "index.html".
              O jogo ainda pode ser embutido no Moodle e outros aplicativos que aceitam arquivos de objetos
              de aprendizagem em formato SCORM.
            </b-card-text>
          </b-card>
        </b-card-group>
      </b-collapse>
    </div>
    <b-jumbotron
      header="Tales Ludos"
      lead="Ferramenta online para construção de jogos educacionais"
    >
      <p>
        Tales Ludos é uma ferramenta online de autoria
        que possibilita a construção de um jogo baseado em cenários,
        locais do cenário, personagens e interações, que exige pouco
        conhecimento técnico por parte do usuário/autor de jogos.
        O roteiro do jogo é criado com o preenchimento de
        alguns formulários, onde o autor define o título, uma descrição
        e uma imagem de fundo para o jogo. Nessa imagem base, o projetista deve
        incluir os locais onde ocorrerão as interações no jogo.
        Em cada local é apresentado um conteúdo da cena e para cada
        conteúdo é apresentado um desafio. Ao vencer o desafio, o jogo
        passa para próxima etapa/cena. Para ilustrar essa evolução acontece
        uma animação com um personagem. O objetivo é favorecer a usabilidade
        do programa, de modo que professores e estudantes com pouca fluência
        tecnológica consigam construir e usar os jogos. A ferramenta de autoria
        conta ainda com facilidades de exportação e publicação do jogo,
        de modo que o jogo construído (SCORM, html5 e javascript) possa ser
        utilizado nos mais diversos
        sistemas operacionais (linux, windows, ios) e nos mais diversos
        dispositivos (computadores, tablets, smartphones).
      </p>
      <b-button variant="primary" href="/game/index.html" target="_blank">Exemplo de jogo</b-button>
    </b-jumbotron>
    <hr />
    <div>
      <b-embed
        type="iframe"
        aspect="16by9"
        src="https://youtube.com/embed/EWVYXlFXFhE"
        allowfullscreen
      ></b-embed>
    </div>
    <div class="row">
      <div class="col">
        <h2>Apoio</h2>
        <div class="row">
          <div class="col text-center">
            <a href="http://www.capes.gov.br">
              <img
                src="/images/capes.jpg"
                class="img-fluid w-25 height: auto"
                alt="Logomarca da UNIFAL-MG"
              />
            </a>
          </div>
          <div class="col text-center">
            <a href="http://www.unifal-mg.edu.br">
              <img
                src="/images/unifal.png"
                class="img-fluid w-75 height: auto"
                alt="Logomarca da CAPES"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <div class="row">
      <div class="col">
        <h2>Desenvolvido com</h2>
        <div class="row">
          <div class="col text-center">
            <figure class="figure">
              <a href="https://laravel.com">
                <img src="/images/laravel.svg" class="img-fluid w-50 height: auto" alt="Laravel" />
              </a>
            </figure>
          </div>
          <div class="col text-center">
            <figure class="figure">
              <a href="https://vuejs.org">
                <img src="/images/vuejs.png" class="img-fluid w-50 height: auto" alt="Vue JS" />
              </a>
            </figure>
          </div>
          <div class="col text-center">
            <figure class="figure">
              <a href="https://p5js.org">
                <img src="/images/p5js.png" class="img-fluid w-50 height: auto" alt="P5 JS" />
              </a>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
