"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { CalculatorIcon, X, RefreshCw, ArrowRight, DollarSign, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { DataCalculator } from "@/types/data.type"

export function Calculator({ data, setIsCalculated }: DataCalculator) {
    const [stakes, setStakes] = useState<Record<number, number>>({})
    const [checked, setChecked] = useState<Record<number, boolean>>({})
    const [totalStake, setTotalStake] = useState(100)
    const [totalProfit, setTotalProfit] = useState(0)
    const [currency, setCurrency] = useState("USD") // USD o PEN
    const [exchangeRate, setExchangeRate] = useState(3.7) // Tipo de cambio predeterminado (1 USD = 3.7 PEN)
    const [showExchangeRateInput, setShowExchangeRateInput] = useState(false)

    // Extraer secciones (casas de apuestas) del objeto data de forma segura
    const sections = useMemo(() => {
        if (!data?.sections || !Array.isArray(data.sections)) return []
        return data.sections.filter((section) => section && typeof section === "object")
    }, [data])

    // Función para calcular ganancias basadas en stakes y cuotas
    const calculateProfits = useCallback(
        (currentStakes: Record<number, number>, currentChecked: Record<number, boolean>) => {
            const profits: Record<number, number> = {}
            let totalInvested = 0

            // Calcular el total invertido primero
            sections.forEach((section, index) => {
                if (currentChecked[index]) {
                    const stake = Number.parseFloat(String(currentStakes[index] || 0))
                    if (!isNaN(stake)) {
                        totalInvested += stake
                    }
                }
            })

            // Luego calcular las ganancias para cada sección
            sections.forEach((section, index) => {
                if (!section || !section.odds) {
                    profits[index] = 0
                    return
                }

                const stake = Number.parseFloat(String(currentStakes[index] || 0))
                const odds = Number.parseFloat(String(section.odds || 0))

                if (isNaN(stake) || isNaN(odds) || odds <= 0) {
                    profits[index] = 0
                } else {
                    // Ganancia = (stake * cuota) - total invertido
                    profits[index] = Number.parseFloat((stake * odds - totalInvested).toFixed(2))
                }
            })

            return profits
        },
        [sections],
    )

    // Inicializar stakes y checked al cargar el componente
    useEffect(() => {
        if (!sections || sections.length === 0) return

        try {
            const initialStakes: Record<number, number> = {}
            const initialChecked: Record<number, boolean> = {}

            // Calcular el factor de normalización (suma de inversos de cuotas)
            let normalizationFactor = 0
            sections.forEach((section) => {
                const odds = Number.parseFloat(String(section?.odds || 0))
                if (!isNaN(odds) && odds > 0) {
                    normalizationFactor += 1 / odds
                }
            })

            // Si no hay cuotas válidas, usar distribución uniforme
            if (normalizationFactor <= 0) {
                sections.forEach((_, index) => {
                    initialStakes[index] = Number.parseFloat((totalStake / sections.length).toFixed(2))
                    initialChecked[index] = true
                })
            } else {
                // Calcular stakes óptimos
                sections.forEach((section, index) => {
                    const odds = Number.parseFloat(String(section?.odds || 0))
                    if (!isNaN(odds) && odds > 0) {
                        initialStakes[index] = Number.parseFloat((totalStake / (normalizationFactor * odds)).toFixed(2))
                    } else {
                        initialStakes[index] = 0
                    }
                    initialChecked[index] = true
                })
            }

            setStakes(initialStakes)
            setChecked(initialChecked)

            // Calcular ganancias iniciales
            const initialProfits = calculateProfits(initialStakes, initialChecked)

            // Calcular ganancia total
            const profitTotal = Object.values(initialProfits).reduce((sum, profit) => sum + profit, 0) / sections.length
            setTotalProfit(Number.parseFloat(profitTotal.toFixed(2)))
        } catch (error) {
            console.error("Error al inicializar la calculadora:", error)
            // Inicialización de respaldo en caso de error
            const fallbackStakes: Record<number, number> = {}
            const fallbackChecked: Record<number, boolean> = {}

            sections.forEach((_, index) => {
                fallbackStakes[index] = Number.parseFloat((totalStake / sections.length).toFixed(2))
                fallbackChecked[index] = true
            })

            setStakes(fallbackStakes)
            setChecked(fallbackChecked)
        }
    }, [sections, calculateProfits])

    // Recalcular totales y ganancias cuando cambian los stakes o selecciones
    useEffect(() => {
        try {
            let total = 0

            // Calcular stake total
            sections.forEach((_, index) => {
                if (checked[index]) {
                    const stake = Number.parseFloat(String(stakes[index] || 0))
                    if (!isNaN(stake)) {
                        total += stake
                    }
                }
            })

            setTotalStake(Number.parseFloat(total.toFixed(2)))

            // Calcular ganancias
            const profits = calculateProfits(stakes, checked)

            // Calcular ganancia total (promedio de ganancias)
            const activeSelections = Object.values(checked).filter(Boolean).length
            if (activeSelections > 0) {
                const profitTotal =
                    Object.entries(profits)
                        .filter(([index]) => checked[Number(index)])
                        .reduce((sum, [, profit]) => sum + profit, 0) / activeSelections

                setTotalProfit(Number.parseFloat(profitTotal.toFixed(2)))
            } else {
                setTotalProfit(0)
            }
        } catch (error) {
            console.error("Error al calcular totales:", error)
        }
    }, [stakes, checked, sections, calculateProfits])

    // Función para manejar cambios en los stakes
    const handleStakeChange = useCallback((index: number, value: string) => {
        const newValue = Number.parseFloat(value)
        if (isNaN(newValue)) return

        setStakes((prev) => ({
            ...prev,
            [index]: Number.parseFloat(newValue.toFixed(2)),
        }))
    }, [])

    // Función para manejar cambios en los checkboxes
    const handleCheckChange = useCallback((index: number, value: boolean) => {
        setChecked((prev) => ({
            ...prev,
            [index]: value,
        }))
    }, [])

    // Función para optimizar los stakes
    const optimizeStakes = useCallback(() => {
        try {
            const activeIndices = Object.entries(checked)
                .filter(([, isChecked]) => isChecked)
                .map(([index]) => Number(index))

            if (activeIndices.length === 0) return

            const newStakes = { ...stakes }
            let normalizationFactor = 0

            // Calcular factor de normalización solo para selecciones activas
            activeIndices.forEach((index) => {
                const section = sections[index]
                const odds = Number.parseFloat(String(section?.odds || 0))
                if (!isNaN(odds) && odds > 0) {
                    normalizationFactor += 1 / odds
                }
            })

            if (normalizationFactor <= 0) {
                // Distribución uniforme si no hay cuotas válidas
                const equalStake = totalStake / activeIndices.length
                activeIndices.forEach((index) => {
                    newStakes[index] = Number.parseFloat(equalStake.toFixed(2))
                })
            } else {
                // Calcular stakes óptimos
                activeIndices.forEach((index) => {
                    const section = sections[index]
                    const odds = Number.parseFloat(String(section?.odds || 0))
                    if (!isNaN(odds) && odds > 0) {
                        newStakes[index] = Number.parseFloat((totalStake / (normalizationFactor * odds)).toFixed(2))
                    }
                })
            }

            setStakes(newStakes)
        } catch (error) {
            console.error("Error al optimizar stakes:", error)
        }
    }, [checked, sections, stakes, totalStake])

    // Función para resetear la calculadora
    const resetCalculator = useCallback(() => {
        try {
            const resetStakes: Record<number, number> = {}
            const resetChecked: Record<number, boolean> = {}

            sections.forEach((_, index) => {
                resetStakes[index] = Number.parseFloat((100 / sections.length).toFixed(2))
                resetChecked[index] = true
            })

            setStakes(resetStakes)
            setChecked(resetChecked)
            setTotalStake(100)
        } catch (error) {
            console.error("Error al resetear la calculadora:", error)
        }
    }, [sections])

    // Función para cambiar la moneda
    const handleCurrencyChange = useCallback((value: string) => {
        setCurrency(value)
    }, [])

    // Función para actualizar el tipo de cambio
    const handleExchangeRateChange = useCallback((value: string) => {
        const newRate = Number.parseFloat(value)
        if (!isNaN(newRate) && newRate > 0) {
            setExchangeRate(newRate)
        }
    }, [])

    // Función para convertir valores entre monedas
    const convertCurrency = useCallback(
        (amount: number, targetCurrency: string) => {
            if (targetCurrency === currency) return amount

            // Convertir de USD a PEN
            if (currency === "USD" && targetCurrency === "PEN") {
                return amount * exchangeRate
            }

            // Convertir de PEN a USD
            if (currency === "PEN" && targetCurrency === "USD") {
                return amount / exchangeRate
            }

            return amount
        },
        [currency, exchangeRate],
    )

    // Obtener símbolo de moneda
    const getCurrencySymbol = useCallback((currencyCode: string) => {
        return currencyCode === "USD" ? "$" : "S/"
    }, [])

    return (
        <Card className="md:w-[550px] ml-4 sticky top-4 border shadow-md animate-in slide-in-from-right duration-300">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Calculadora de Surbets
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsCalculated(false)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {data?.header?.percent || "0%"} de beneficio
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        {data?.header?.home1 || "Equipo 1"} vs {data?.header?.home2 || "Equipo 2"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="space-y-4">
                    {/* Selector de moneda y tipo de cambio */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Tabs defaultValue="USD" value={currency} onValueChange={handleCurrencyChange} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="USD" className="flex items-center gap-1">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        <span>Dólares (USD)</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="PEN" className="flex items-center gap-1">
                                        <Coins className="h-3.5 w-3.5" />
                                        <span>Soles (PEN)</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExchangeRateInput(!showExchangeRateInput)}
                                className="text-xs"
                            >
                                {showExchangeRateInput ? "Ocultar" : "Cambiar"} tipo de cambio
                            </Button>

                            {showExchangeRateInput ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">1 USD =</span>
                                    <Input
                                        type="number"
                                        value={exchangeRate}
                                        onChange={(e) => handleExchangeRateChange(e.target.value)}
                                        className="w-20 h-8 text-center"
                                        step="0.01"
                                        min="0.01"
                                    />
                                    <span className="text-xs text-muted-foreground">PEN</span>
                                </div>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant="outline"
                                                className="bg-secondary/10 text-secondary-foreground border-secondary/30"
                                            >
                                                1 USD = {exchangeRate.toFixed(2)} PEN
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Haz clic en Cambiar tipo de cambio para modificar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    <div className="bg-card/50 rounded-lg p-4 border border-border/30 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Stake Total</p>
                                <p className="text-xl font-bold">
                                    {getCurrencySymbol(currency)} {totalStake.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {currency === "USD"
                                        ? `≈ S/ ${convertCurrency(totalStake, "PEN").toFixed(2)}`
                                        : `≈ $ ${convertCurrency(totalStake, "USD").toFixed(2)}`}
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                            <div>
                                <p className="text-sm text-muted-foreground">Ganancia Potencial</p>
                                <p className={`text-xl font-bold ${totalProfit > 0 ? "text-green-500" : "text-destructive"}`}>
                                    {getCurrencySymbol(currency)} {totalProfit.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {currency === "USD"
                                        ? `≈ S/ ${convertCurrency(totalProfit, "PEN").toFixed(2)}`
                                        : `≈ $ ${convertCurrency(totalProfit, "USD").toFixed(2)}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-1/2 bg-primary/10 border-primary/30 hover:bg-primary/20"
                            onClick={optimizeStakes}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Optimizar Stakes
                        </Button>
                        <Button variant="outline" size="sm" className="w-1/2" onClick={resetCalculator}>
                            Resetear
                        </Button>
                    </div>

                    <Separator className="my-2" />

                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="text-center">
                                    <TableHead>Casa</TableHead>
                                    <TableHead>Apuesta</TableHead>
                                    <TableHead>Cuota</TableHead>
                                    <TableHead>Stake</TableHead>
                                    <TableHead className="w-[30px]"></TableHead>
                                    <TableHead>Ganancia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.map((section, index) => {
                                    // Calcular ganancia para esta sección
                                    const stake = Number.parseFloat(String(stakes[index] || 0))
                                    const odds = Number.parseFloat(String(section?.odds || 0))
                                    const totalInvested = Object.entries(stakes)
                                        .filter(([idx]) => checked[Number(idx)])
                                        .reduce((sum, [, value]) => sum + (Number.parseFloat(String(value)) || 0), 0)

                                    let profit = 0
                                    if (!isNaN(stake) && !isNaN(odds) && odds > 0) {
                                        profit = Number.parseFloat((stake * odds - totalInvested).toFixed(2))
                                    }

                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{section?.book_name || "Casa"}</TableCell>
                                            <TableCell className="text-xs">{section?.market || "Apuesta"}</TableCell>
                                            <TableCell>{section?.odds || "0.00"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="text-xs mr-1">{getCurrencySymbol(currency)}</span>
                                                    <Input
                                                        type="number"
                                                        value={stakes[index] || 0}
                                                        onChange={(e) => handleStakeChange(index, e.target.value)}
                                                        className="w-24 h-8 text-center"
                                                        disabled={!checked[index]}
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={checked[index] || false}
                                                    onCheckedChange={(value) => handleCheckChange(index, !!value)}
                                                />
                                            </TableCell>
                                            <TableCell className={profit > 0 ? "text-green-500" : "text-destructive"}>
                                                {getCurrencySymbol(currency)} {profit.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}

                                <TableRow className="font-bold bg-muted/30">
                                    <TableCell colSpan={4} className="text-right">
                                        Total:
                                    </TableCell>
                                    <TableCell>
                                        {getCurrencySymbol(currency)} {totalStake.toFixed(2)}
                                    </TableCell>
                                    <TableCell className={totalProfit > 0 ? "text-green-500" : "text-destructive"}>
                                        {getCurrencySymbol(currency)} {totalProfit.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p>* Los stakes se expresan en {currency === "USD" ? "dólares ($)" : "soles (S/)"}</p>
                        <p>* La ganancia potencial se calcula en base a los stakes seleccionados.</p>
                        <p>* Tipo de cambio actual: 1 USD = {exchangeRate.toFixed(2)} PEN</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
