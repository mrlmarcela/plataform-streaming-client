<template>
  <v-app-bar color="black" flat dense class="px-6 d-flex align-center">
    <!-- Logo -->
    <router-link to="/" class="d-flex align-center">
      <img src="@/assets/logo.svg" width="180px" />
    </router-link>

    <!-- Ícone do menu (hambúrguer) visível em telas pequenas) -->
    <v-app-bar-nav-icon
      class="ms-auto d-md-none"
      @click="drawer = !drawer"
    />

    <!-- Links visíveis apenas em telas médias ou maiores -->
    <div
      class="d-none d-md-flex align-center gap-4 ps-10 ms-10"
    >
      <router-link
        to="/"
        class="nav-link"
        :class="{ active: route.path === '/' }"
      >
        Início
      </router-link>
      <router-link
        to="/playlists"
        class="nav-link"
        :class="{ active: route.path === '/playlists' }"
      >
        Minhas playlists
      </router-link>
    </div>
  </v-app-bar>

  <!-- Drawer para telas pequenas -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    class="d-md-none"
  >
    <v-list nav>
      <v-list-item
        to="/"
        :active="route.path === '/'"
        @click="drawer = false"
      >
        <v-list-item-title>Início</v-list-item-title>
      </v-list-item>
      <v-list-item
        to="/playlists"
        :active="route.path === '/playlists'"
        @click="drawer = false"
      >
        <v-list-item-title>Minhas playlists</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const drawer = ref(false)
</script>


<style scoped>
.nav-link {
  text-decoration: none;
  color: white;
  text-transform: capitalize;
  font-weight: 400;
  transition: background-color 0.2s;
  padding: 8px 12px;
  border-radius: 4px;
}

.nav-link:hover {
  color: #b3b3b3;
}

.nav-link.active {
  color: #FF8747
}
</style>
