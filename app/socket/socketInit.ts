// socketInit.ts
import { useSocketStore } from './useSocketStore'

export function initWebSocket(url: string) {
    const {
        setSocket,
        setConnectionStatus,
        setError,
    } = useSocketStore.getState()

    const socket = new WebSocket(url)
    setSocket(socket)

    socket.onopen = () => {
        console.log('✅ WebSocket conectado')
        setConnectionStatus('connected')
        setError('')
    }

    socket.onerror = (err) => {
        console.error('Error WebSocket:', err)
        setConnectionStatus('disconnected')
        setError('Error al conectar al servidor')
    }

    socket.onclose = () => {
        console.log('❌ WebSocket desconectado')
        setConnectionStatus('disconnected')
    }

    return socket
}
