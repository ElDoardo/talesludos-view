<template>
  <div id="tela" ref="tela" center fluid class="w-100">
    <vue-p5 @preload="preload" @setup="setup" @draw="draw" @mousepressed="mousepressed" @mousedragged="mousedragged"
      @mousereleased="mousereleased" />
  </div>
</template>

<script>
import VueP5 from "vue-p5";

import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  props: ["mode", "markedpoint", "marks", "links", "image"],
  name: "game-canvas",
  components: {
    "vue-p5": VueP5,
    BootstrapVue
  },
  data() {
    return {
      diameter: 50,
      w: 0,
      h: 300,
      back: null,
      isMobile: false,
      dragging: false, // a marca está sendo arrastada?
      dragPoint: -1, // marca sendo arrastada
      isMobile: false
    };
  },
  created: function () {
    console.log("Game Canvas created");
    // console.log("image = " + this.image);
    // console.log(this.marks);
  },
  mounted: function () {
    console.log("Game Canvas mounted");
    // console.log("image = " + this.image);
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0; // detecta se é mobile
  },
  computed: {
    mkPoint: {
      get: function () {
        return this.markedpoint;
      },
      set: function (value) {
        this.$emit("update-edit", value);
      }
    }
  },
  methods: {
    preload(sketch) {
      //   console.log("Image (preload sketch) = " + this.image);
      const fileName = this.image.split('/');
      this.back = sketch.loadImage('http://localhost:3000/api/journey/'+ fileName[2]+'/'+fileName[4]);
      this.w = this.$refs.tela.clientWidth;
      //this.h = (this.w / this.back.width) * this.back.height;
    },
    setup(sketch) {
      this.$nextTick(() => {
        sketch.createCanvas(this.w, this.h);
      });
      window.addEventListener("resize", () => {
        this.w = this.$refs.tela.clientWidth;
        //this.h = (this.w / this.back.width) * this.back.height;
        sketch.resizeCanvas(this.w, this.h);
      });
    },
    // calcula a menor distancia de um ponto para uma linha
    pDistance(x, y, x1, y1, x2, y2) {
      var A = x - x1;
      var B = y - y1;
      var C = x2 - x1;
      var D = y2 - y1;

      var pto = A * C + B * D;
      var norm = C * C + D * D;
      var param = -1;
      if (norm != 0)
        //norm zero
        param = pto / norm;

      var xx, yy;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      var dx = x - xx;
      var dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
    },

    // função pra quando o mouse é arrastado
    mousedragged({ mouseX, mouseY }) {
      if (this.isMobile) return;
      if (this.isMobile) return;
      if (this.dragging && this.dragPoint !== -1) {
        this.marks.coords[this.dragPoint].x = mouseX / this.w;
        this.marks.coords[this.dragPoint].y = mouseY / this.h;
      }
    },

    // função pra quando o mouse é solto
    mousereleased() {
      if (this.isMobile) return;
      this.dragging = false;
      this.dragPoint = -1;
    },

    // função pra quando o mouse é clicado
    mousepressed({ mouseX, mouseY, pmouseX, pmouseY }) {
      let x = mouseX;
      let y = mouseY;

      // testa limite
      if (
        x > this.diameter / 2 &&
        y > this.diameter / 2 &&
        x < this.w - this.diameter / 2 &&
        y < this.h - this.diameter / 2
      ) {
        // identifica a marca clicada
        let pos = -1;
        for (let i = 0; i < this.marks.coords.length; i++) {
          let px = this.marks.coords[i].x;
          let py = this.marks.coords[i].y;
          if (
            Math.abs(px * this.w - x) < this.diameter / 2 &&
            Math.abs(py * this.h - y) < this.diameter / 2
          ) {
            pos = i;
          }
        }

        if (pos !== -1) {
          this.dragging = true;
          this.dragPoint = pos;
        }

        // identifica linha clicada
        let lin = -1;
        for (let i = 0; i < this.links.length; i++) {
          if (!this.links[i].removed) {
            let x1 = this.marks.coords[this.links[i].i].x * this.w;
            let y1 = this.marks.coords[this.links[i].i].y * this.h;
            let x2 = this.marks.coords[this.links[i].j].x * this.w;
            let y2 = this.marks.coords[this.links[i].j].y * this.h;
            let dist = this.pDistance(x, y, x1, y1, x2, y2);
            if (dist < this.diameter / 2) lin = i;
          }
        }

        // Criar marca nova
        if (this.mode == 1) {
          // marcar
          if (pos == -1) {
            this.marks.coords.push({
              id: this.marks.nextMark,
              x: x / this.w,
              y: y / this.h
            });

            this.marks.nextMark++;

            // gerando links automaticamente
            if (this.marks.coords.length > 1) {
              this.links.push({
                i: this.marks.coords.length - 2,
                j: this.marks.coords.length - 1,
                removed: false
              });
            }

            this.mkPoint = -1;
            this.dragging = true;
            this.dragIndex = this.mkPoint;
          }
        } else {
          // desmarcar
          if (this.mkPoint != -1 && this.mkPoint == pos) {
            this.mkPoint = -1;
          } else {
            // ponto para mover ou ligar
            if (this.mkPoint == -1) {
              this.mkPoint = pos;
            } else {
                if (this.mode == 4) {
                  this.marks.coords[this.mkPoint].x = x / this.w;
                  this.marks.coords[this.mkPoint].y = y / this.h;
                  this.mkPoint = -1;
                } else {
                this.mkPoint = -1;
              }
            }
          }

        }
      }
      //   sketch.redraw();
    },

    draw(sketch) {
      sketch.background(200);
      sketch.stroke(0);
      sketch.strokeWeight(2);
      sketch.noTint();

      if (this.back) sketch.image(this.back, 0, 0, this.w, this.h);

      let lastPoint = null;

      for (let i = 0; i < this.links.length; i++) {
        if (!this.links[i].removed) {
          let x1 = this.marks.coords[this.links[i].i].x * this.w;
          let y1 = this.marks.coords[this.links[i].i].y * this.h;
          let x2 = this.marks.coords[this.links[i].j].x * this.w;
          let y2 = this.marks.coords[this.links[i].j].y * this.h;

          lastPoint = { x: x2, y: y2 };
        }
      }

      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      for (let i = 0; i < this.marks.coords.length; i++) {
        sketch.strokeWeight(2);
        sketch.stroke(255);
        if (i == this.mkPoint)
          sketch.fill(170, 102, 204);
        else
            sketch.fill(66, 133, 244);

        sketch.ellipse(
          this.marks.coords[i].x * this.w,
          this.marks.coords[i].y * this.h,
          this.diameter
        );
        sketch.fill(255);
        sketch.strokeWeight(1);
        sketch.text(
          "" + this.marks.coords[i].id,
          this.marks.coords[i].x * this.w,
          this.marks.coords[i].y * this.h
        );
      }
      //   sketch.noLoop();
    }
  }
};
</script>