"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BettingOpportunityCard from "@/components/scrap/card-oportunity"
import WebSocketStatus from "@/components/scrap/socket-status"
import { ArrowUpDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calculator } from "@/components/scrap/calculator"
import { Surebet, MessageSocket } from "@/types/data.type"

export default function Home() {
    const [bettingData, setBettingData] = useState<Surebet[]>([])
    const [connectionStatus, setConnectionStatus] = useState("connecting")
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [sortBy, setSortBy] = useState("percent")
    const [isCalculated, setIsCalculated] = useState(false)
    const [isRemove, setIsRemove] = useState(false)
    const [dataSelect, setDataSelect] = useState<Surebet | null>(null)

    useEffect(() => {
        // Conectar al WebSocket
        const socket = new WebSocket("ws://localhost:4002")

        socket.onopen = () => {
            console.log("✅ Conectado al servidor WebSocket")
            setConnectionStatus("connected")
            setError("")
        }

        socket.onmessage = (event: MessageEvent) => {
            try {
                // Validar que event.data existe y es una cadena válida
                if (!event.data) {
                    console.error("Datos recibidos vacíos")
                    return
                }

                const message: MessageSocket = JSON.parse(event.data)

                // Validar que message tiene la estructura esperada
                if (!message || typeof message !== "object") {
                    console.error("Formato de mensaje inválido")
                    return
                }

                if (message.type === "prematch_data") {
                    const data = message.payload

                    // Si es un array, usarlo directamente
                    if (Array.isArray(data)) {
                        // Filtrar elementos nulos o indefinidos
                        const validData = data.filter((item) => item && typeof item === "object") as Surebet[]
                        setBettingData(validData)
                    }
                    // Si es un objeto con una propiedad que contiene el array
                    else if (data && typeof data === "object") {
                        // Buscar la primera propiedad que sea un array
                        const arrayProp = Object.keys(data).find((key) => Array.isArray(data[key]))
                        if (arrayProp) {
                            // Filtrar elementos nulos o indefinidos
                            const validData = (data[arrayProp] as unknown[]).filter((item) => item && typeof item === "object") as Surebet[]
                            setBettingData(validData)
                        } else {
                            // Si es un solo objeto de datos, verificar que sea válido antes de agregarlo
                            if (Object.keys(data).length > 0) {
                                setBettingData((prev) => [...prev, data])
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Error al procesar los datos:", err)
                setError("Error al procesar los datos del servidor")
            }
        }

        socket.onclose = () => {
            console.log("❌ Desconectado del servidor WebSocket")
            setConnectionStatus("disconnected")
        }

        socket.onerror = (err) => {
            console.error("Error en la conexión WebSocket:", err)
            setConnectionStatus("disconnected")
            setError("Error en la conexión al servidor")
        }

        // Limpiar la conexión al desmontar
        return () => {
            socket.close()
        }
    }, [])

    // Obtener deportes únicos para las pestañas con validación
    const uniqueSports = Array.from(
        new Set(
            bettingData.filter((item) => item && item.header && item.header.sportName).map((item) => item.header.sportName),
        ),
    )

    // Filtrar datos según la pestaña activa con validación
    const filteredData =
        activeTab === "all"
            ? bettingData
            : bettingData.filter(
                (item) => item && item.header && item.header.sportName && item.header.sportName === activeTab,
            )

    // Ordenar datos con validación completa
    const sortedData = [...filteredData].sort((a, b) => {
        // Validar que a y b tienen la estructura esperada
        if (!a || !a.header || !b || !b.header) return 0

        if (sortBy === "percent") {
            // Validar que percent existe y es un número válido
            const percentA = a.header.percent ? Number.parseFloat(a.header.percent.replace("%", "")) : 0
            const percentB = b.header.percent ? Number.parseFloat(b.header.percent.replace("%", "")) : 0

            // Usar isNaN para verificar si la conversión fue exitosa
            if (isNaN(percentA) && isNaN(percentB)) return 0
            if (isNaN(percentA)) return 1
            if (isNaN(percentB)) return -1

            return percentB - percentA
        } else {
            // Convertir tiempo a segundos para comparar con validación
            const getSeconds = (time: string) => {
                if (!time || typeof time !== "string") return 0

                if (time.includes("min")) {
                    const minutes = Number.parseInt(time.replace(/[^0-9]/g, ""))
                    return isNaN(minutes) ? 0 : minutes * 60
                } else if (time.includes("sec")) {
                    const seconds = Number.parseInt(time.replace(/[^0-9]/g, ""))
                    return isNaN(seconds) ? 0 : seconds
                }
                return 0
            }

            const timeA = a.header.time ? getSeconds(a.header.time) : 0
            const timeB = b.header.time ? getSeconds(b.header.time) : 0

            return timeA - timeB
        }
    })

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-2 md:p-4">
            <div className="max-w-full mx-auto">
                <header className="mb-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                        <div>
                            <h1 className="text-2xl font-bold">SurbetsPro</h1>
                            <p className="text-gray-400 text-sm">Oportunidades de arbitraje deportivo en tiempo real</p>
                        </div>
                        <WebSocketStatus status={connectionStatus} error={error} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                            <TabsList className="bg-gray-800 h-8">
                                <TabsTrigger value="all" className="text-xs h-6">Todos</TabsTrigger>
                                {uniqueSports.map((sport) => (
                                    <TabsTrigger key={sport} value={sport} className="text-xs h-6">
                                        {sport}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 text-xs">
                                        <ArrowUpDown className="h-3 w-3" />
                                        <span>Ordenar</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy("percent")}>Por porcentaje</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("time")}>Por tiempo</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <div className="flex gap-3 w-full justify-center">
                    <div className="grid grid-cols-1 gap-2 w-full md:w-[800px] ">
                        {sortedData.length > 0 ? (
                            sortedData.map((item, index) => (
                                item ?
                                    <BettingOpportunityCard
                                        key={index}
                                        data={item}
                                        setIsCalculated={setIsCalculated}
                                        setIsRemove={setIsRemove}
                                        setDataSelect={setDataSelect}
                                    /> : null
                            ))
                        ) : connectionStatus === "connected" ? (
                            <div className="col-span-full text-center py-6">
                                <p className="text-gray-400">No hay datos disponibles en este momento</p>
                            </div>
                        ) : (
                            <div className="col-span-full text-center py-6">
                                <p className="text-gray-400">Conectando al servidor...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {isCalculated && dataSelect && <Calculator data={dataSelect} setIsCalculated={setIsCalculated} />}
                    </div>
                    <div className="flex-shrink-0">
                        {isRemove}
                    </div>
                </div>
            </div>
        </main>
    )
}
