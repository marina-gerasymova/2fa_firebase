<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Register />
  </div>
</template>

<script>
// @ is an alias to /src
import Register from "@/components/Register.vue";

export default {
  name: "Home",
  components: {
    Register,
  },
};
</script>
