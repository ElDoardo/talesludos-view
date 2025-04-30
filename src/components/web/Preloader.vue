<template>
  <div></div>
</template>
<script>
export default {
  created: function() {
    console.log("fetch areas");
    this.$store.dispatch("fetchareas");
  }
};
</script>
