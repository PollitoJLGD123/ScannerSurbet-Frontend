// socketInit.ts
import { useSocketStore } from './useSocketStore'

let reconnectInterval: NodeJS.Timeout | null = null;
const RECONNECT_DELAY = 5000; // milisegundos
let currentSocket: WebSocket | null = null;

export function initWebSocket(url: string) {
    const {
        setSocket, setConnected
    } = useSocketStore.getState()

    if (currentSocket) {
        currentSocket.close();
    }

    const socket = new WebSocket(url)
    currentSocket = socket;
    setSocket(socket)

    socket.onopen = () => {
        console.log('✅ WebSocket conectado');
        setConnected(true)
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
        setConnected(false)
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                console.log('🔄 Intentando reconectar...');
                initWebSocket(url); // vuelve a intentar
            }, RECONNECT_DELAY);
        }
    };

    return socket
}

export function closeWebSocket() {
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
    if (currentSocket) {
        currentSocket.close();
        currentSocket = null;
    }
    const { setConnected } = useSocketStore.getState();
    setConnected(false);
}

export function returnSocket(){
    return { currentSocket, }
}

