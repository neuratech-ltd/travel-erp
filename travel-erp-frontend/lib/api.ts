import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.PUBLIC_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
