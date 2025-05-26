<template>
  <div>
    <v-btn
      variant="text"
      @click="returnToPlaylist()"
      class="mb-6 text-capitalize pa-0"
    >
      <v-icon>mdi-arrow-left</v-icon>
      Voltar
    </v-btn>

    <p class="text-h6 mb-6">{{ playlist?.name }}</p>

    <v-row v-if="playlist && playlist.items && playlist.items.length > 0">
      <v-col
        v-for="item in playlist.items"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card outlined>
          <div class="video-thumbnail" @click="openModal(item.url)">
            <v-img
              :src="VideoUtils.getYouTubeThumbnail(item.url)"
              height="220"
              cover
            />
            <v-icon class="play-icon" size="56">mdi-play-circle-outline</v-icon>
          </div>

          <v-card-title class="d-flex align-center gap-2 text-subtitle-1">
            <p class="text-truncate">{{ item.title }}</p>
          </v-card-title>

          <v-card-subtitle> Categoria: {{ item.category }} </v-card-subtitle>

          <v-card-text class="mt-2 pb-3">
            {{ item.description }}
          </v-card-text>

          <v-card-actions>
            <v-btn text color="error" @click="removeItem(item.id)"
              >Remover</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="my-2">
      <p class="mb-3">Não há itens nessa playlist.</p>
      <v-btn color="primary" @click="goToHomeToAddItems">Adicionar Itens</v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-text class="pa-0">
          <iframe
            v-if="selectedVideoUrl"
            :src="VideoUtils.getYouTubeEmbedUrl(selectedVideoUrl)"
            width="100%"
            height="450"
            frameborder="0"
            allowfullscreen
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6"> Confirmar exclusão </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este item da playlist?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="warning"
      timeout="5000"
      elevation="24"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PlaylistService, Playlist } from "@/services/PlaylistService";
import { VideoUtils } from "@/utils/VideoUtils";

const confirmDialog = ref(false);
const itemToDelete = ref<string | null>(null);
const snackbar = ref(false);
const snackbarMessage = ref("");
const router = useRouter();
const route = useRoute();
const playlist = ref<Playlist | null>(null);

const dialog = ref(false);
const selectedVideoUrl = ref<string | null>(null);

onMounted(async () => {
  await loadPlaylist();
});

async function loadPlaylist() {
  const id = route.params.id as string;
  playlist.value = await PlaylistService.getById(id);
}

function openModal(url: string) {
  selectedVideoUrl.value = url;
  dialog.value = true;
}

function returnToPlaylist() {
  router.push({ name: "playlists" });
}

function removeItem(id: string) {
  itemToDelete.value = id;
  confirmDialog.value = true;
}

async function confirmDelete() {
  if (!playlist.value || !itemToDelete.value) return;

  try {
    const updated = await PlaylistService.removeItemFromPlaylist(
      playlist.value.id,
      itemToDelete.value
    );
    playlist.value = updated;
    snackbarMessage.value = "Item removido com sucesso!";
  } catch (error) {
    console.error("Erro ao remover item:", error);
    snackbarMessage.value = "Erro ao remover item";
  } finally {
    snackbar.value = true;
    confirmDialog.value = false;
    itemToDelete.value = null;
  }
}

function goToHomeToAddItems() {
  router.push({ name: "home" }).then(() => {
    window.location.reload();
  });
}
</script>

<style scoped>
.video-thumbnail {
  position: relative;
  cursor: pointer;
}
.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s ease;
}
.video-thumbnail:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
}
</style>
