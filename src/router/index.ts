import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlaylistsView from '@/views/PlaylistsView.vue'
import PlaylistItemsView from '@/views/PlaylistItemsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: PlaylistsView
  },
  {
    path: '/playlist/:id',
    name: 'playlistItems',
    component: PlaylistItemsView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
