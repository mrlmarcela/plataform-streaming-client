import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export type PlaylistItem = {
    id: string
    title: string
    description: string
    category: string
    url: string
    playlistId?: string
    createdAt: string
    updatedAt: string
  }
  
  export type Playlist = {
    id: string
    name: string
    createdAt?: string
    updatedAt?: string
    items?: PlaylistItem[]
  }

export const PlaylistService = {

  async getAll(): Promise<Playlist[]> {
    const response = await axios.get(`${API_URL}/playlists`)
    return response.data
  },

  async create(name: string) {
    const response = await axios.post(`${API_URL}/playlists`, {
      name: name,
    });
  
    return response.data;
  },

  async getById(id: string): Promise<Playlist> {
    const response = await axios.get(`${API_URL}/playlists/${id}`)
    return response.data
  },

  async removeItemFromPlaylist(playlistId: string, itemId: string) {
    const response = await axios.put(`${API_URL}/playlists/${playlistId}`, {
      removeItemIds: [itemId],
    });
  
    return response.data;
  },

  async addItemToPlaylist(playlistId: string, itemId: string) {
    const response = await axios.put(`${API_URL}/playlists/${playlistId}`, {
      addItemIds: [itemId],
    });
  
    return response.data;
  },

  async delete(id: string) {
    await axios.delete(`${API_URL}/playlists/${id}`);
  }
}
