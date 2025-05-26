<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.bg-dark {
  background-color: #121212;
  min-height: 100vh;
  color: white;
}
</style>
