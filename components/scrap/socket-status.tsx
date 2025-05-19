"use client"

import { Circle } from "lucide-react"

export default function WebSocketStatus({ status, error }: { status: string, error: string }) {
    let color = "text-gray-500"
    let message = "Conectando..."

    if (status === "connected") {
        color = "text-green-500"
        message = "Conectado"
    } else if (status === "disconnected") {
        color = "text-red-500"
        message = "Desconectado"
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <Circle
                className={`h-2 w-2 ${color}`}
                fill={status === "connected" ? "green" : status === "disconnected" ? "red" : "gray"}
            />
            <span>{message}</span>
            {error && <span className="text-red-500">Error: {error}</span>}
        </div>
    )
}
