<template>
  <div class="container">
    <div v-if="update">
      <h1>Editar jogo</h1>
    </div>
    <div v-else>
      <h1>Novo jogo</h1>
    </div>
    <journeyform :id="id" :update="update"></journeyform>
  </div>
</template>

<script>
import journeyform from "./JourneyForm.vue";

export default {
  props: {
    update: false,
    id: {
      require: true
    }
  },
  components: {
    journeyform
  }
};
</script>

