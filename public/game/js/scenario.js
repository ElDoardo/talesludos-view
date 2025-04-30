let x1, y1, x2, y2, angle, flip;

class Scenario {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.marks = [];
        this.links = [];
        this.scenes = [];
        this.challenges = [];
        this.correct;
        this.animate = false;
        this.particulas = [];
        this.currentChallenge = -1;
        this.correctOptionIndex = -1;
        this.answerStates = {};
        this.confetti = [];
        this.back = false;
    }

    // função para resetar o jogo ao clicar em tentar novamente
    reset() {
        this.currentChallenge = -1;
        this.correctOptionIndex = -1;
        this.answerStates = {};
        this.confetti = [];
        this.particulas = [];

        stage = 1;
        points = 0;
        errors = 0;
        percent = 0;
        mode = modes.INTRO; 

        if (optionsRadio) optionsRadio.remove(); 
        if (shortAnswerInput) {
            shortAnswerInput.value(''); 
            shortAnswerInput.hide();
        }
        if (associations) {
            associations.remove();
            associations = null;
        }
        
        localtexto.hide();
        nextButton.hide();
        yesButton.hide();
        noButton.hide();
        submitButton.hide();
        checkButton.hide();
        backToScene.hide();
        tryAgainButton.hide();
    }

    // funções para confetes cairem na tela
    startConfetti() {
        for (var i = 0; i < 3; i++) {
            this.confetti.push(new Confetti(random(0, 800), random(0, 600), random(1, 5)));
        }
    }

    updateConfetti() {
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            this.confetti[i].confettiDisplay();
            if (this.confetti[i].y > this.height + 50) { 
                this.confetti.splice(i, 1);
            }
        }
    }

    // verifica a questão de verdadeiro ou falso
    isCorrect() {
        return this.correct;
    }

    linedash(x1, y1, x2, y2, delta, style) {
        let distance = dist(x1, y1, x2, y2);
        let dashNumber = distance / delta;
        let xDelta = (x2 - x1) / dashNumber;
        let yDelta = (y2 - y1) / dashNumber;
        push();
        strokeWeight(delta);
        for (let i = 0; i < dashNumber; i += 2) {
            let a = i * xDelta + x1;
            let b = i * yDelta + y1;
            let c = (i + 1) * xDelta + x1;
            let d = (i + 1) * yDelta + y1;

            if (style == '-') { line(a, b, c, d); }
            else if (style == '.') { point(a, b); }
            else if (style == 'o') { ellipse(a, b, delta / 2); }
        }
        pop();
    }

    drawLinks() {
        for (let i = 0; i < stage - 1; i++) {
            let link = this.links[i];
            let a = this.marks[link.i].x * this.width + 50;
            let b = this.marks[link.i].y * this.height + 50;
            let c = this.marks[link.j].x * this.width + 50;
            let d = this.marks[link.j].y * this.height + 50;
            this.linedash(a, b, c, d, 3, '.');
        }
    }

    drawMarks() {
        for (let i = 0; i < this.marks.length && i < stage; i++) {
            let x = this.marks[i].x * this.width + 50;
            let y = this.marks[i].y * this.height + 50;
            // console.log(x + ", " + y);
            push();
            if (i < stage)
                tint(255, 255);
            else
                tint(255, 50);
            ctx.drawImage(imgMark, x - 15, y - 15, 30, 30);
            pop();
        }
    }

    drawText(text) {
        texto.style('font-size', '30px');
        texto.html(text);
        localtexto.show();
    }

    // função para desenhar o feedback na tela
    drawFeedBackText(text) {
        texto.style('font-size', '40px');
        texto.html(text);
        localtexto.show();
    }

    drawAnimation() {
        // Draw animation
        let frame = frameCount % nframes;
        let imgFrame = (walking) ? spritesWalk : spritesIdle;

        if (flip) {
            ctx.save();
            ctx.scale(-1.0, 1.0);
            ctx.drawImage(imgFrame, frame * 128, 0, 128, 128, x1 * -1, y1 - 75, len, len);
            ctx.restore();
        } else {
            ctx.drawImage(imgFrame, frame * 128, 0, 128, 128, x1, y1 - 75, len, len);
        }

        if (walking) {
            x1 = x1 - 5 * cos(angle) / 2;
            y1 = y1 - 5 * sin(angle) / 2;
            if (abs(x2 - x1) < 20 && abs(y2 - y1) < 20)
                this.endWalking();
        }

        this.updateConfetti();
    }

    startWalking() {
        nextButton.hide(); // Esconde o botão de próximo
        if (this.links.length > 0) {
            walking = true;
            len = 100;
            let link = this.links[stage - 1];
            x1 = this.marks[link.i].x * this.width + 50;
            y1 = this.marks[link.i].y * this.height + 50;
            x2 = this.marks[link.j].x * this.width + 50;
            y2 = this.marks[link.j].y * this.height + 50;
            angle = atan2(y1 - y2, x1 - x2);
            if (x2 - x1 < 0)
                flip = true;
            else
                flip = false;
        }
    }

    endWalking() {
        walking = false;
        nextButton.show();
        stage = stage + 1;
        mode = modes.SCENE;
    }

    drawTitle() {
        titleSize = titleSize - frameCount / 10;
        titleDiv.style('font-size', titleSize + 'px');
        return titleSize > 50;
    }

    getScene() {
        let i;
        for (i = 0; i < this.scenes.length &&
            this.scenes[i].id != this.marks[stage - 1].id; i++);
        if (i < this.scenes.length)
            return i;
        else
            return -1;
    }

    getChallenge() {
        let i;
        for (i = 0; i < this.challenges.length &&
            this.challenges[i].id != this.marks[stage - 1].id; i++);
        if (i < this.challenges.length)
            return i;
        else
            return -1;
    }

    // função para verificar se a resposta está correta
    verifyCorrectness(selectedOption, answer) {
        let challengeId = this.getChallenge(); 
        if (this.challenges[challengeId].type == 2) { // se o tipo do desafio for de múltipla escolha
            let selectedIndex = this.challenges[challengeId].options.findIndex(option => option.text === selectedOption);
            if (selectedIndex == this.challenges[challengeId].correctOptionIndex) { // verifica se a opção selecionada é a correta
                console.log('Correct option selected');
                return true;
            } else {
                return false;
            }
        } else if (this.challenges[challengeId].type == 5) { // se o tipo do desafio for de resposta curta
            if (this.normalizeString(this.challenges[challengeId].answer) == this.normalizeString(answer)) { // verifica se a resposta fornecida é a correta
                console.log('Correct answer provided');
                return true;
            } else {
                return false;
            }
        }
    }
    
    normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // função para verificar as respostas
    verifyAnswers() {
        let challengeId = this.getChallenge();
        let correct = true;
        if (this.challenges[challengeId].type == 3) {  // se o tipo do desafio for de preenchimento de lacunas
            let index = 0;
            let regex = /\$(.*?)\$/g;
            let texto = this.challenges[challengeId].content;
            texto = texto.replace(regex, (match, palavra) => {
                index++;
                let input = document.getElementById('palvra-' + index);
                let isCorrect = this.normalizeString(input.value) === this.normalizeString(palavra); // verifica se a palavra fornecida é a correta
                input.style.backgroundColor = isCorrect ? 'lightgreen' : 'lightcoral'; // muda a cor de fundo do input
                input.style.borderColor = isCorrect ? 'green' : 'red'; // muda a cor da borda do input
                input.disabled = isCorrect; // desabilita o input se a resposta estiver correta

                this.answerStates['palvra-' + index] = { value: input.value, isCorrect: isCorrect }; // salva o estado da resposta
                
                if (!isCorrect) correct = false;
            });

            if (correct) { // se todas as respostas estiverem corretas limpa o estado das respostas e remove do localStorage
                this.answerStates = {}; 
                for (let index = 0; index < this.challenges[challengeId].content.length; index++) {
                    localStorage.removeItem('palavra-' + index);
                }
            }
        } else if (this.challenges[challengeId].type == 4) { // se o tipo do desafio for de associação
            let palavras = this.challenges[challengeId].associations;
            palavras.forEach((p, index) => {
                let select = document.getElementById('associated-' + index);
                let selectedText = select.options[select.selectedIndex].text;
                let isCorrect = selectedText === p.associated; // verifica se a palavra associada é a correta

                select.style.backgroundColor = isCorrect ? 'lightgreen' : 'lightcoral'; // muda a cor de fundo do select
                select.style.borderColor = isCorrect ? 'green' : 'red'; // muda a cor da borda do select
                select.disabled = isCorrect; // desabilita o select se a resposta estiver correta

                this.answerStates['associated-' + index] = { selectedIndex: select.selectedIndex, isCorrect: isCorrect }; // salva o estado da resposta
                
                if (!isCorrect) correct = false;
            });
            if (correct) { // se todas as respostas estiverem corretas limpa o estado das respostas e remove do localStorage
                this.answerStates = {}; 
                for (let index = 0; index < this.challenges[challengeId].associations.length; index++) {
                    localStorage.removeItem('associated-' + index);
                }
            }
        }

        return correct;
    }

    // função para restaurar as respostas salvas nos estados
    restoreAnswers() {
        for (let id in this.answerStates) {
            let state = this.answerStates[id];
            let element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') { // verifica se o elemento é um <select>
                    element.selectedIndex = state.selectedIndex; // restaure o índice selecionado
                } else {
                    element.value = state.value; // para inputs, apenas em caso de outros tipos
                }
                element.style.backgroundColor = state.isCorrect ? 'lightgreen' : 'lightcoral'; // mantenha a cor de fundo
                element.style.borderColor = state.isCorrect ? 'green' : 'red'; // mantenha a cor da borda
                element.disabled = state.isCorrect; // desabilite o elemento se a resposta estava correta
            }
        }
    }

    // função para atualizar o id do desafio atual
    updateCurrentChallengeId() {
        this.currentChallenge = this.getChallenge() - 1;
    }

    show() {
        let challengeId = this.getChallenge();
        switch (mode) {
            case modes.TITLE:
                if (!this.drawTitle()) mode = modes.INTRO;
                x1 = 60;
                y1 = 400;
                break;
            case modes.INTRO:
                startButton.show();
                this.drawText(game.introduce);
                break;
            case modes.SCENE:
                // esconder botões do desafio anterior ao mudar de cena
                startButton.hide();
                yesButton.hide();
                noButton.hide();
                submitButton.hide();
                if (shortAnswerInput) shortAnswerInput.hide();
                if (optionsRadio) optionsRadio.hide();
                if (associations) { // remove o container de associações
                    associations.remove();
                    associations = null;
                }
                nextButton.show(); // mostra o botão de próximo
                checkButton.hide();
                backToScene.hide();
                let sceneId = this.getScene();
                if (sceneId == -1)
                    this.drawText("Descrição da cena " + stage);
                else
                    this.drawText(this.scenes[sceneId].content);
                break;
            case modes.CHALLENGE:
                this.back = false;
                if (challengeId == -1) {
                    nextButton.show();
                    this.drawText("Descrição do Desafio " + stage);
                }
                else {                   
                    if (this.challenges[challengeId].type == 2) { // se o tipo do desafio for de múltipla escolha
                        if (this.currentChallenge != challengeId) { // se o desafio atual for diferente do desafio anterior (isso evita que o código seja executado várias vezes)
                            this.drawText(this.challenges[challengeId].content);
                            this.currentChallenge = challengeId;
                            let optionsContainer = createElement('div').parent(localtexto); // cria um container para as opções
                            optionsRadio = createRadio().parent(optionsContainer); // cria um radio button para as opções
                            optionsRadio.style('display', 'block');
                            optionsRadio.hide();
                            this.challenges[challengeId].options.forEach((option) => {
                                optionsRadio.option(option.text); // adiciona as opções ao radio button
                            });
                            this.radioOpitionSet = true;
                        }
                        optionsRadio.show();
                        submitButton.show();
                    } else if (this.challenges[challengeId].type == 3) { // se o tipo do desafio for de preenchimento de lacunas
                        if (this.currentChallenge != challengeId) {
                            this.currentChallenge = challengeId;
                            // criar inputs no lugar das palavras marcadas no texto
                            let regex = /\$(.*?)\$/g;
                            let texto = this.challenges[challengeId].content;
                            let index = 0;
                            texto = texto.replace(regex, () => {
                                index++;
                                return '<input style="width: 90px; margin-top: 5px" type="text" id="palvra-' + index + '">';
                            });
                            this.drawText(texto);
                            if (this.answerStates) // se houver respostas salvas, restaure-as
                               this.restoreAnswers();
                        }

                        checkButton.show();
                        backToScene.show();
                    } else if (this.challenges[challengeId].type == 4) { // se o tipo do desafio for de associação
                        this.drawText(this.challenges[challengeId].content);
                        if (this.currentChallenge != challengeId) {
                            this.currentChallenge = challengeId;
                            let palavras = this.challenges[challengeId].associations;
                            let allAssociations = palavras.map(a => a.associated); // pega todas as palavras associadas

                            palavras.forEach((p, index) => {
                                if (!this.answerStates['associated-' + index]) { // se não houver respostas salvas, embaralhe as palavras associadas e salve-as
                                    for (let i = allAssociations.length - 1; i > 0; i--) {
                                        const j = Math.floor(Math.random() * (i + 1));
                                        [allAssociations[i], allAssociations[j]] = [allAssociations[j], allAssociations[i]];
                                    }
                                    localStorage.setItem('associated-' + index, JSON.stringify(allAssociations));
                                } else { // se houver respostas salvas, restaure-as
                                    allAssociations = JSON.parse(localStorage.getItem('associated-' + index));
                                }
                            });
                            
                            let htmlContent = palavras.map((a, index) => { // cria um select para cada palavra associada
                                let selectOptions = [`<option value="">Selecione</option>`].concat(allAssociations.map(option => 
                                    `<option>${option}</option>`
                                )).join('');
                            
                                return `<div style="display: flex; justify-content: space-between; align-items: center; margin: 10px;">
                                            <p style="background-color: lightblue; padding: 10px; border-radius: 30px; width: 40%; text-align: center;" id="text-${index}">${a.text}</p>
                                            <select id="associated-${index}" style="border-radius: 5px; height: 25px; width: 50%;">
                                                ${selectOptions}
                                            </select>
                                        </div>`;
                            }).join('');

                           associations = createDiv(htmlContent).parent(localtexto);                            
                           if (this.answerStates)  // se houver respostas salvas, restaure-as
                               this.restoreAnswers();
                        }
                        checkButton.show();
                        backToScene.show();
                    } else if (this.challenges[challengeId].type == 5) { // se o tipo do desafio for de resposta curta
                        this.drawText(this.challenges[challengeId].content);
                        if (this.currentChallenge != challengeId) {
                            this.currentChallenge = challengeId;
                            shortAnswerInput = createInput().parent(localtexto) // cria um input para a resposta
                            .hide()
                            .attribute('placeholder', 'Digite a resposta');
                        }
                        shortAnswerInput.show();
                        submitButton.show();
                    } else { // se o tipo do desafio for de verdadeiro ou falso
                        yesButton.show();
                        noButton.show();
                        this.correct = this.challenges[challengeId].correct; // salva a resposta correta
                    }
                    nextButton.hide(); 
                }
                break;
            case modes.ANIMA:
                localtexto.hide();
                break;
            case modes.STOP:
                // esconder botões do desafio anterior ao terminar o jogo
                nextButton.hide();
                yesButton.hide();
                noButton.hide();
                if (optionsRadio) optionsRadio.hide();
                submitButton.hide();
                checkButton.hide();
                if (shortAnswerInput) shortAnswerInput.hide();
                backToScene.hide();
                if (associations) {
                    associations.remove(); // remove o container de associações
                    associations = null;
                }
                if (percent > 50) { // se o percentual de acertos for maior que 50%
                    this.drawFeedBackText("Parabéns! Você acertou " + percent + "% das questões.");
                    this.startConfetti(); // inicia a chuva de confetes
                } else { // se o percentual de acertos for menor que 50%
                    this.drawFeedBackText("Erros acontecem, é importante aprender com eles. Tente novamente.");
                } 
                tryAgainButton.show(); // mostra o botão de tentar novamente
                for (var i = 0; i < particulas.length; i++) {
                    var v = particulas[i];
                    v.efeito();
                    v.update();
                    v.show();
                }
                break;
        }
        if (mode != modes.INTRO && mode != modes.TITLE) {
            this.drawLinks();
            this.drawMarks();
        }
        this.drawAnimation();
    }
}