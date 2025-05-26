<template>
  <div class="text-start mt-4 mb-4">
    <v-btn color="primary" @click="showCreateDialog = true">
      <v-icon left>mdi-plus</v-icon>
      {{
        orderedPlaylists.length === 0
          ? "Criar sua primeira Playlist"
          : "Criar Nova Playlist"
      }}
    </v-btn>
  </div>
  <div v-if="Object.keys(groupedItems).length > 0">
    <div
      v-for="(items, category) in groupedItems"
      :key="category"
      class="mb-10 pt-4"
    >
      <h2 class="text-h6 mb-4">{{ category }}</h2>

      <v-slide-group show-arrows>
        <v-slide-group-item v-for="item in items" :key="item.id">
          <v-card outlined width="300px" class="me-6">
            <div class="video-thumbnail" @click="openModal(item.url)">
              <v-img
                :src="VideoUtils.getYouTubeThumbnail(item.url)"
                height="220"
                cover
              />
              <v-icon class="play-icon" size="56"
                >mdi-play-circle-outline</v-icon
              >
            </div>

            <v-card-title class="d-flex align-center gap-2 text-h6">
              <p class="text-truncate">{{ item.title }}</p>
            </v-card-title>

            <v-card-text class="mt-2 pb-3 text-subtitle-2">
              {{ item.description }}
            </v-card-text>

            <v-card-actions>
              <v-btn text color="primary" @click="addToPlaylist(item)"
                >Adicionar à Playlist</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
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

    <v-dialog v-model="addDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 pa-4 ms-3 mt-2">
          Adicionar à Playlist
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="selectedPlaylistId"
            v-if="orderedPlaylists.length > 0"
          >
            <v-radio
              v-for="playlist in orderedPlaylists"
              :key="playlist.id"
              :label="playlist.name"
              :value="playlist.id"
              color="primary"
            />
          </v-radio-group>
          <div v-else class="d-flex flex-column gap-4">
            <span
              >Você não tem nenhuma playlist criada. Crie uma nova playlist
              antes de adicionar um item.</span
            >
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="addDialog = false">Cancelar</v-btn>
          <v-btn
            :disabled="!selectedPlaylistId"
            color="primary"
            text
            @click="confirmAddToPlaylist"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="5000"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
  <div v-else>
    <p class="text-center text-subtitle-1">
      Nenhum item encontrado. Adicione novos itens à sua biblioteca!
    </p>
  </div>

  <v-dialog v-model="showCreateDialog" max-width="500px">
    <v-card>
      <v-card-title>Criar Nova Playlist</v-card-title>
      <v-card-text>
        <v-text-field
          label="Nome da playlist"
          v-model="newPlaylistName"
          :rules="[(v) => !!v || 'Nome é obrigatório']"
          autofocus
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="cancelCreate">Cancelar</v-btn>
        <v-btn color="primary" @click="createPlaylist">Criar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ItemService, Item } from "@/services/ItemService";
import { VideoUtils } from "@/utils/VideoUtils";
import { Playlist, PlaylistService } from "@/services/PlaylistService";

const allItems = ref<Item[]>([]);
const dialog = ref(false);
const selectedVideoUrl = ref<string | null>(null);
const snackbar = ref(false);
const snackbarMessage = ref("");
const playlists = ref<Playlist[]>([]);

const showCreateDialog = ref(false);
const newPlaylistName = ref("");
const showCreatedDialog = ref(false);

const orderedPlaylists = computed(() =>
  playlists.value.slice().sort((a, b) => a.name.localeCompare(b.name))
);

const selectedPlaylistId = ref<string | null>(null);
const selectedItemToAdd = ref<Item | null>(null);
const addDialog = ref(false);

const router = useRouter();

onMounted(async () => {
  allItems.value = await ItemService.getAll();
});

const groupedItems = computed(() => {
  const grouped: Record<string, Item[]> = {};
  for (const item of allItems.value) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }
  return grouped;
});

function openModal(url: string) {
  selectedVideoUrl.value = url;
  dialog.value = true;
}

async function addToPlaylist(item: Item) {
  selectedItemToAdd.value = item;
  playlists.value = await PlaylistService.getAll();
  selectedPlaylistId.value = null;
  addDialog.value = true;
}

async function confirmAddToPlaylist() {
  if (!selectedPlaylistId.value || !selectedItemToAdd.value) return;

  try {
    await PlaylistService.addItemToPlaylist(
      selectedPlaylistId.value,
      selectedItemToAdd.value.id
    );
    snackbarMessage.value = `"${selectedItemToAdd.value.title}" adicionado com sucesso à playlist!`;
  } catch (error) {
    console.error(error);
    snackbarMessage.value = "Erro ao adicionar o item à playlist.";
  } finally {
    snackbar.value = true;
    addDialog.value = false;
    selectedItemToAdd.value = null;
    selectedPlaylistId.value = null;
  }
}

function cancelCreate() {
  showCreateDialog.value = false;
  newPlaylistName.value = "";
}

async function createPlaylist() {
  if (!newPlaylistName.value.trim()) {
    snackbarMessage.value = "Nome da playlist é obrigatório.";
    snackbar.value = true;
    return;
  }
  try {
    const created = await PlaylistService.create(newPlaylistName.value.trim());
    playlists.value.push(created);
    showCreateDialog.value = false;
    showCreatedDialog.value = true;
    newPlaylistName.value = "";
    snackbarMessage.value =
      "Playlist criada com sucesso! Você pode adicionar itens agora.";
    snackbar.value = true;
  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    snackbarMessage.value = "Erro ao criar playlist";
    snackbar.value = true;
  }
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
.min-w-300 {
  min-width: 300px;
}
</style>
