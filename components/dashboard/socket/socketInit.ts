// socketInit.ts
import { useSocketStore } from './useSocketStore'

let reconnectInterval: NodeJS.Timeout | null = null;
const RECONNECT_DELAY = 5000; // milisegundos

export function initWebSocket(url: string) {
    const {
        setSocket
    } = useSocketStore.getState()

    const socket = new WebSocket(url)
    setSocket(socket)

    socket.onopen = () => {
        console.log('✅ WebSocket conectado');
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    socket.onerror = (err) => {
        console.error('Error WebSocket:', err)
    }

    socket.onclose = () => {
        console.log('❌ WebSocket desconectado, intentando reconectar en 5 segundos...');
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                console.log('🔄 Intentando reconectar...');
                initWebSocket(url); // vuelve a intentar
            }, RECONNECT_DELAY);
        }
    };

    return socket
}

