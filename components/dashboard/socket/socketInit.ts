// socketInit.ts
import { useSocketStore } from './useSocketStore'

export function initWebSocket(url: string) {
    const {
        setSocket
    } = useSocketStore.getState()

    const socket = new WebSocket(url)
    setSocket(socket)

    socket.onopen = () => {
        console.log('✅ WebSocket conectado')
    }

    socket.onerror = (err) => {
        console.error('Error WebSocket:', err)
    }

    socket.onclose = () => {
        console.log('❌ WebSocket desconectado')
    }

    return socket
}
