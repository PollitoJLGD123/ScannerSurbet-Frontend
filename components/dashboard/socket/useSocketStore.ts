import { create } from 'zustand'

interface SocketStore {
    socket: WebSocket | null
    connected: boolean;
    setSocket: (socket: WebSocket) => void
    setConnected: (connected: boolean) => void
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
    connected: false,
    setConnected: (connected) => set({ connected }),
}))
