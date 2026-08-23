import axios from 'axios'

export const api = axios.create({
  baseURL: `${(import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? ''}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})
