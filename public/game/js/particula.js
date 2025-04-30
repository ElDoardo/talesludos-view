// Modified by Luiz Eduardo da Silva
// Based from
// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

class Particula {
    constructor(x, y) {
        this.posicao = createVector(random(width), random(height));
        this.destino = createVector(x, y);
        this.velocidade = p5.Vector.random2D();
        this.aceleracao = createVector();
        this.raio = 8;
        this.maxvel = 10;
        this.maxforca = 1;
    }

    efeito() {
        var chegar = this.chegar(this.destino);
        var mouse = createVector(mouseX, mouseY);
        var fugir = this.fugir(mouse);

        chegar.mult(1);
        fugir.mult(5);
        this.aplicaForca(chegar);
        this.aplicaForca(fugir);
    }

    chegar(destino) {
        var desejado = p5.Vector.sub(destino, this.posicao);
        var d = desejado.mag();
        var vel = this.maxvel;
        if (d < 100) {
            vel = map(d, 0, 100, 0, this.maxvel);
        }
        desejado.setMag(vel);
        var steer = p5.Vector.sub(desejado, this.velocidade);
        steer.limit(this.maxforca);
        return steer;
    }

    fugir(destino) {
        var desejado = p5.Vector.sub(destino, this.posicao);
        var d = desejado.mag();
        if (d < 30) {
            desejado.setMag(this.maxvel);
            desejado.mult(-1);
            var steer = p5.Vector.sub(desejado, this.velocidade);
            steer.limit(this.maxforca);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    aplicaForca(forca) {
        this.aceleracao.add(forca);
    }

    update() {
        this.posicao.add(this.velocidade);
        this.velocidade.add(this.aceleracao);
        this.aceleracao.mult(0);
    }

    show() {
        push();
        var x = this.posicao.x;
        var y = this.posicao.y;
        stroke(200, 50, 50);
        strokeWeight(this.raio);
        point(x, y);
        pop();
    }

}

