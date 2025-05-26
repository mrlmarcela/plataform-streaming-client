<template>
  <div>
    <v-row class="pb-6 d-flex justify-space-between align-center">
      <v-col cols="12" md="6">
        <p class="text-h5">Minhas Playlists</p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-start justify-md-end">
        <v-btn color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Criar Playlist
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="playlist in playlists"
        :key="playlist.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card outlined hover ripple @click="goToPlaylist(playlist.id)">
          <v-card-title class="text-h6">
            <v-row class="d-flex justify-space-between align-center">
              <v-col>{{ playlist.name }}</v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  @click.stop="deletePlaylist(playlist.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-subtitle> {{ playlist.items.length }} itens </v-card-subtitle>
          <v-card-text>
            Última atualização: {{ formatDate(playlist.updatedAt) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6"> Confirmar exclusão </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir esta playlist?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" text @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    <v-dialog v-model="showCreatedDialog" max-width="400px">
      <v-card>
        <v-card-title>Playlist criada!</v-card-title>
        <v-card-text> Deseja adicionar itens agora? </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="showCreatedDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="goToHomeToAddItems"
            >Adicionar Itens</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="warning"
      timeout="5000"
      location="top right"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { PlaylistService, Playlist } from "@/services/PlaylistService";

const confirmDialog = ref(false);
const playlistToDelete = ref<string | null>(null);
const snackbar = ref(false);
const snackbarMessage = ref("");
const router = useRouter();
const playlists = ref<Playlist[]>([]);

const showCreateDialog = ref(false);
const newPlaylistName = ref("");
const showCreatedDialog = ref(false);
let createdPlaylistId = "";

onMounted(async () => {
  playlists.value = await PlaylistService.getAll();
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function goToPlaylist(id: string) {
  router.push({
    name: "playlistItems",
    params: { id },
  });
}

function deletePlaylist(id: string) {
  playlistToDelete.value = id;
  confirmDialog.value = true;
}

async function confirmDelete() {
  if (!playlistToDelete.value) return;

  try {
    await PlaylistService.delete(playlistToDelete.value);
    playlists.value = playlists.value.filter(
      (p) => p.id !== playlistToDelete.value
    );
    snackbarMessage.value = "Playlist excluída com sucesso!";
  } catch (error) {
    console.error("Erro ao excluir playlist:", error);
    snackbarMessage.value = "Erro ao excluir playlist";
  } finally {
    confirmDialog.value = false;
    snackbar.value = true;
    playlistToDelete.value = null;
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
    createdPlaylistId = created.id;
    showCreateDialog.value = false;
    showCreatedDialog.value = true;
    newPlaylistName.value = "";
  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    snackbarMessage.value = "Erro ao criar playlist";
    snackbar.value = true;
  }
}

function goToHomeToAddItems() {
  showCreatedDialog.value = false;
  router.push({ name: "home" }).then(() => {
    window.location.reload();
  });
}
</script>

<style scoped></style>
