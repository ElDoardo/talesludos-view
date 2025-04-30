var startButton, nextButton, yesButton, noButton, submitButton, optionsRadio, shortAnswerInput, checkButton, associations, backToScene, tryAgainButton;
var gameStage, gamePoints, gameErrors;
var mode;
let nframes = 15;
let walking = false;
let ctx;
let nStage = 0;
let stage = 1;
let points = 0;
let errors = 0;
let titleSize;
let len = 200;
let localtexto, texto;
let posTexto;
let font;
let particulas = [];
var percent = 0;

const modes = {
    TITLE: "Título",
    STOP: "Fim",
    INTRO: "Apresentação",
    SCENE: "Cena",
    CHALLENGE: "Desafio",
    ANIMA: "Animação"
};

function preload() {
    back = document.getElementById("fundo");
    img = document.getElementById("mapa");
    imgMark = document.getElementById("marca");
    spritesWalk = document.getElementById("walk");
    spritesIdle = document.getElementById("idle")
}

function particulasPoints(dig, px, py) {
    for (var i = 0; i < digitos[dig].length; i++) {
        let x = px + digitos[dig][i].x * 70;
        let y = py + digitos[dig][i].y * 90;
        particulas.push(new Particula(x, y));
    }
}

function getPoints() {
    let result = getPercentage();
    let dig = result % 10;
    particulasPoints(dig, 640, 500);
    result = floor(result / 10);
    if (result > 0) {
        dig = result % 10;
        particulasPoints(dig, 570, 500);
        result = floor(result / 10);
        if (result > 0) {
            dig = result % 10;
            particulasPoints(dig, 500, 500);
        }
    }
    particulasPoints(10, 710, 500);
}

// função para calcular a porcentagem de acertos
function getPercentage() {
    return Math.round(Math.max(0, (1 - errors / scenario.marks.length) * 100));
}

function setup() {
    background(0);
    canvas = createCanvas(800, 600);
    ctx = canvas.drawingContext;

    startButton = createButton('J O G A R')
        .position(50, 20)
        .style('border-radius', '10px')
        .hide()
        .mousePressed(() => {
            mode = modes.SCENE;
            stage = 1;
            points = 0;
            errors = 0;
            particulas = [];
        });
    nextButton = createButton('Continua')
        .position(200, 500)
        .style('background-color', 'black')
        .style('color', 'white')
        .hide()
        .mousePressed(() => {
            switch (mode) {
                case modes.INTRO: mode = modes.SCENE; break;
                case modes.SCENE: mode = modes.CHALLENGE; break;
                case modes.CHALLENGE: {
                    if (stage < nStages) {
                        mode = modes.ANIMA;
                        scenario.startWalking();
                    }
                    else
                        mode = modes.STOP;
                    break;
                }
            }
        });
    styleButtons(nextButton);
    yesButton = createButton('Certo')
        .position(400, 500)
        .hide()
        .mousePressed(() => {
            if (scenario.isCorrect()) {
                if (stage < nStages) {
                    mode = modes.ANIMA;
                    scenario.startWalking();
                }
                else {
                    mode = modes.STOP;
                    this.getPoints();
                    percent = getPercentage();
                }
            } else {
                mode = modes.SCENE;
                errors++;
            }
        });
    styleButtons(yesButton);
    noButton = createButton('Errado')
        .position(500, 500)
        .hide()
        .mousePressed(() => {
            if (!scenario.isCorrect()) {
                if (stage < nStages) {
                    mode = modes.ANIMA;
                    scenario.startWalking();
                }
                else {
                    this.getPoints();
                    mode = modes.STOP;
                    percent = getPercentage();
                }
            } else {
                mode = modes.SCENE;
                errors++;
            }
        });
    styleButtons(noButton);

    submitButton = createButton('Enviar')
        .position(500, 500)
        .hide()
        .mousePressed(() => {
            let option;
            let shortAnswer;
            // Verifica se os elementos existem antes de acessar seus valores
            if (!optionsRadio) option = ""; else option = optionsRadio.value();
            if (!shortAnswerInput) shortAnswer = ""; else shortAnswer = shortAnswerInput.value();
            // Verifica se a resposta está correta
            if (scenario.verifyCorrectness(option, shortAnswer)) {          
                if (stage < nStages) {
                    if (optionsRadio) optionsRadio.remove();
                    mode = modes.ANIMA;
                    scenario.startWalking();
                }
                else {
                    this.getPoints();
                    mode = modes.STOP;
                    percent = getPercentage();
                }
            } else {
                mode = modes.SCENE;
                errors++;
            }
        });
    styleButtons(submitButton);

    checkButton = createButton('Verificar')
        .position(500,500)
        .hide()
        .mousePressed(() => {
            // Verifica se as respostas estão corretas
            if (scenario.verifyAnswers()) {
                if (stage < nStages) {
                    mode = modes.ANIMA;
                    scenario.startWalking();
                }
                else {
                    this.getPoints();
                    mode = modes.STOP;
                    percent = getPercentage();
                }
            } else {
                errors++;
            }
        });
    styleButtons(checkButton);

    // botão para voltar à cena nas questões de associação e preenchimento de lacunas
    backToScene = createButton('Ver Cena')
        .position(300, 500)
        .hide()
        .mousePressed(() => {
            scenario.updateCurrentChallengeId();
            mode = modes.SCENE;
        });
    styleButtons(backToScene);

    // botão para tentar novamente ao final do jogo
    tryAgainButton = createButton('Tentar Novamente')
        .position(300, 500)
        .hide()
        .mousePressed(() => {
            mode = modes.INTRO;
            scenario.reset();
        }
    );
    styleButtons(tryAgainButton);

    titleDiv = createDiv(game.title)
        .position(50, 50)
    titleSize = 500;

    gameStage = createElement('h2', 'Fase:' + stage)
        .position(200, 0)
        .style('color', 'white');
    gamePoints = createElement('h2', 'Modo:' + mode)
        .position(320, 0)
        .style('color', 'white');
    gameErrors = createElement('h2', 'Erros:' + errors)
        .position(600, 0)
        .style('color', 'white');

    localtexto = createDiv('')
        .position(200, 120, 'fixed')
        .size(400, 300)
        .style('background', 'rgba(255, 255, 255, 0.14)')
        .style('border-radius', '16px')
        .style('box-shadow', '0 4px 30px rgba(0, 0, 0, 0.1)')
        .style('backdrop-filter', 'blur(5px)')
        .style('-webkit-backdrop-filter', 'blur(5px)')
        .style('border', '1px solid rgba(255, 255, 255, 0.3)')
        .style('padding', '20px') 
        .style('color', 'black') 
        .style('overflow', 'auto')
        .hide();

    posTexto = 0;
    texto = createSpan('')
        .parent(localtexto)

    scenario = new Scenario(ctx, width - 100, height - 100);
    scenario.marks = game.marks.coords;
    scenario.links = game.links;
    scenario.scenes = game.scenes;
    scenario.challenges = game.challenges;

    nStages = scenario.marks.length;
    mode = modes.TITLE;
}

function changePos(event) {
    if (event.deltaY > 0)
        if (posTexto < texto.style.height)
            posTexto = posTexto + 10;
        else
            if (posTexto > 10)
                posTexto = posTexto - 10;
    texto.position(0, posTexto);
}

// função para estilizar botões
function styleButtons (btn) {
    btn.style('border', 'none');
    btn.style('text-align', 'center');
    btn.style('font-size', '16px');
    btn.style('cursor', 'pointer');
    btn.style('border-radius', '20px');
    btn.style('padding', '10px 20px');
}

function draw() {
    background(200);
    ctx.drawImage(back, 0, 0, width, height);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(img, 50, 50, width - 100, height - 100);
    ctx.globalAlpha = 1;
    gameStage.html('Fase:' + stage);
    gamePoints.html('Modo:' + mode);
    gameErrors.html('Erros:' + errors);
    stroke(0);
    scenario.show();
}