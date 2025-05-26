import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export type Item = {
    id: string
    title: string
    description: string
    category: string
    url: string
    playlistId?: string
    createdAt: string
    updatedAt: string
  }
  

export const ItemService = {

  async getAll(): Promise<Item[]> {
    const response = await axios.get(`${API_URL}/items`)
    return response.data
  },

  async getById(id: string): Promise<Item> {
    const response = await axios.get(`${API_URL}/items/${id}`)
    return response.data
  },
}
