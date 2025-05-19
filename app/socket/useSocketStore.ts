import { create } from 'zustand'

interface SocketStore {
    socket: WebSocket | null
    setSocket: (socket: WebSocket) => void
    connectionStatus: string
    setConnectionStatus: (status: string) => void
    error: string
    setError: (error: string) => void
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
    connectionStatus: 'disconnected',
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    error: '',
    setError: (error) => set({ error }),
}))
