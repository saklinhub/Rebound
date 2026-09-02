import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const simulateWebhook = async (payload: any): Promise<void> => {
  await api.post('/webhook/razorpay', payload)
}
