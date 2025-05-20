"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BettingOpportunityCard from "@/components/scrap/card-oportunity"
//import WebSocketStatus from "@/components/scrap/socket-status"
import { ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Calculator } from "@/components/scrap/calculator"
import type { Surebet, MessageSocket } from "@/types/data.type"
import { useSocketStore } from "@/components/dashboard/socket/useSocketStore"

export default function Live() {
    const [bettingData, setBettingData] = useState<Surebet[]>([])
    //const [connectionStatus, setConnectionStatus] = useState("connecting")
    //const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [sortBy, setSortBy] = useState("percent")
    const [isCalculated, setIsCalculated] = useState(false)
    const [isRemove, setIsRemove] = useState(false)
    const [dataSelect, setDataSelect] = useState<Surebet | null>(null)
    const socket = useSocketStore((state) => state.socket)

    useEffect(() => {
        if (!socket){
            console.log("Socket no establecido")
            return
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

                if (message.type === "live_data") {
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
                            const validData = (data[arrayProp] as unknown[]).filter(
                                (item) => item && typeof item === "object",
                            ) as Surebet[]
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
                //setError("Error al procesar los datos del servidor")
            }
        }

    }, [socket])

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
        <main className="min-h-screen bg-background text-foreground">
            <div className="max-w-full mx-auto p-4 space-y-6">
                <header className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                SurbetsPro
                            </h1>
                            <p className="text-muted-foreground text-sm">Oportunidades de arbitraje deportivo en tiempo real</p>
                        </div>
                        { /*<WebSocketStatus status={connectionStatus} error={error} />*/ }
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                            <TabsList className="h-9 bg-muted/50 backdrop-blur-sm">
                                <TabsTrigger value="all" className="text-xs h-7">
                                    Todos
                                </TabsTrigger>
                                {uniqueSports.map((sport) => (
                                    <TabsTrigger key={sport} value={sport} className="text-xs h-7">
                                        {sport}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 text-xs">
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

                <div className="flex gap-6 w-full justify-center">
                    <div className="grid grid-cols-1 gap-4 w-full md:w-[600px]">
                        {sortedData.length > 0 ? (
                            sortedData.map((item, index) =>
                                item ? (
                                    <BettingOpportunityCard
                                        key={index}
                                        data={item}
                                        setIsCalculated={setIsCalculated}
                                        setIsRemove={setIsRemove}
                                        setDataSelect={setDataSelect}
                                    />
                                ) : null,
                            )
                        ) : (
                            <div className="col-span-full text-center py-12 rounded-lg border border-border/30 bg-card/10 backdrop-blur-sm">
                                <p className="text-muted-foreground">No hay datos disponibles en este momento</p>
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {isCalculated && dataSelect && <Calculator data={dataSelect} setIsCalculated={setIsCalculated} />}
                    </div>
                    <div className="flex-shrink-0">{isRemove}</div>
                </div>
            </div>
        </main>
    )
}
