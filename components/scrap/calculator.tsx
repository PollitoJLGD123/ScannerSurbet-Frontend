"use client"

import { useState, useEffect } from "react"
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
import { DataCalculator } from "@/types/data.type"
import { useMemo } from "react"

export function Calculator({ data, setIsCalculated }: DataCalculator) {
    const [stakes, setStakes] = useState<Record<number, number>>({})
    const [checked, setChecked] = useState<Record<number, boolean>>({})
    const [ganancias, setGanancias] = useState<Record<number, number>>({})
    const [totalStake, setTotalStake] = useState(100)
    const [totalProfit, setTotalProfit] = useState(0)
    const [currency, setCurrency] = useState("USD") // USD o PEN
    const [exchangeRate, setExchangeRate] = useState(3.7) // Tipo de cambio predeterminado (1 USD = 3.7 PEN)
    const [showExchangeRateInput, setShowExchangeRateInput] = useState(false)

    // Extraer secciones (casas de apuestas) del objeto data
    const sections = useMemo(() => data?.sections || [], [data])

    // Inicializar stakes y checked al cargar el componente
    useEffect(() => {
        const initialStakes: Record<number, number> = {}
        const initialChecked : Record<string, boolean> = {}
        const initialGanancias: Record<number, number> = {}
        let number_surbet = 0

        sections.forEach((section) => {
            number_surbet += 1/parseFloat(section.odds)
        });

        sections.forEach((section, index) => {
            initialStakes[index] = parseFloat((totalStake / (number_surbet * parseFloat(section.odds))).toFixed(2))
            initialChecked[index] = true
        })

        sections.forEach((section, index) => {
            initialGanancias[index] = parseFloat((initialStakes[index] * parseFloat(section.odds) - totalStake).toFixed(2))
        })

        setStakes(initialStakes)
        setChecked(initialChecked)
        setGanancias(initialGanancias)
    }, [data, sections, totalStake])

    // Calcular ganancias y total cuando cambian los stakes o selecciones
    useEffect(() => {
        let total = 0
        let profit = 0

        sections.forEach((section, index) => {
            if (checked[index]) {
                const stake = Number.parseFloat(String(stakes[index] ?? 0))
                total += stake

                // Calcular ganancia potencial (stake * cuota)
                const odds = Number.parseFloat(String(ganancias[index] ?? 0))
                if (!isNaN(odds) && !isNaN(stake)) {
                    profit += odds
                }
            }
        })

        setTotalStake(total)
        setTotalProfit(profit)
    }, [stakes, checked, sections, ganancias])

    // Función para manejar cambios en los stakes
    const handleStakeChange = (index: number, value: string) => {
        const newValue = Number.parseFloat(value) || 0
        setStakes((prev) => ({
            ...prev,
            [index]: newValue,
        }))
    }

    // Función para manejar cambios en los checkboxes
    const handleCheckChange = (index: number, value: boolean) => {
        setChecked((prev) => ({
            ...prev,
            [index]: value,
        }))
    }

    // Función para resetear la calculadora
    const resetCalculator = () => {
        const initialStakes: Record<string, number> = {}
        sections.forEach((_, index) => {
            initialStakes[index] = Math.floor(100 / sections.length)
        })
        setStakes(initialStakes)    
    }

    // Función para cambiar la moneda
    const handleCurrencyChange = (value: string) => {
        setCurrency(value)
    }

    // Función para actualizar el tipo de cambio
    const handleExchangeRateChange = (value: string) => {
        const newRate = Number.parseFloat(value) || 3.7
        setExchangeRate(newRate)
    }

    // Función para convertir valores entre monedas
    const convertCurrency = (amount: number, targetCurrency: string) => {
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
    }

    // Obtener símbolo de moneda
    const getCurrencySymbol = (currencyCode: string) => {
        return currencyCode === "USD" ? "$" : "S/"
    }

    return (
        <Card className="md:w-[550px] ml-4 sticky top-4 bg-gray-900 border-gray-700 shadow-xl animate-in slide-in-from-right">
            <CardHeader className="bg-gray-800 rounded-t-lg pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg font-bold">Calculadora de Surbets</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsCalculated(false)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                        {data?.header?.percent || "0%"} de beneficio
                    </Badge>
                    <span className="text-sm text-gray-400">
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
                                    <span className="text-xs text-gray-400">1 USD =</span>
                                    <Input
                                        type="number"
                                        value={exchangeRate}
                                        onChange={(e) => handleExchangeRateChange(e.target.value)}
                                        className="w-20 h-8 text-center"
                                        step="0.01"
                                        min="0.01"
                                    />
                                    <span className="text-xs text-gray-400">PEN</span>
                                </div>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
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

                    <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-400">Stake Total</p>
                                <p className="text-xl font-bold">
                                    {getCurrencySymbol(currency)} {totalStake.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {currency === "USD"
                                        ? `≈ S/ ${convertCurrency(totalStake, "PEN").toFixed(2)}`
                                        : `≈ $ ${convertCurrency(totalStake, "USD").toFixed(2)}`}
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-500 mx-2" />
                            <div>
                                <p className="text-sm text-gray-400">Ganancia Potencial</p>
                                <p className={`text-xl font-bold ${totalProfit > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {getCurrencySymbol(currency)} {totalProfit.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
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
                            className="w-1/2 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Optimizar Stakes
                        </Button>
                        <Button variant="outline" size="sm" className="w-1/2" onClick={resetCalculator}>
                            Resetear
                        </Button>
                    </div>

                    <Separator className="my-2 bg-gray-700" />

                    <div className="rounded-lg border border-gray-700 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-800">
                                <TableRow className = "text-center">
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
                                    //const stake = Number.parseFloat(String(stakes[index] || 0))
                                    //const odds = Number.parseFloat(section.odds || "0")
                                    //const profit = !isNaN(stake) && !isNaN(odds) ? (stake * odds - totalStake).toFixed(2) : "0.00"

                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{section.book_name || "Casa"}</TableCell>
                                            <TableCell className="text-xs">{section.market || "Apuesta"}</TableCell>
                                            <TableCell>{section.odds || "0.00"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="text-xs mr-1">{getCurrencySymbol(currency)}</span>
                                                    <Input
                                                        type="number"
                                                        value={stakes[index] || 0}
                                                        onChange={(e) => handleStakeChange(index, e.target.value)}
                                                        className="w-24 h-8 text-center"
                                                        disabled={!checked[index]}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={checked[index] || false}
                                                    onCheckedChange={(value) => handleCheckChange(index, !!value)}
                                                />
                                            </TableCell>
                                            <TableCell className={ganancias[index] > 0 ? "text-green-500" : "text-red-500"}>
                                                {getCurrencySymbol(currency)} {ganancias[index]}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}

                                <TableRow className="bg-gray-800/50 font-bold">
                                    <TableCell colSpan={4} className="text-right">
                                        Total:
                                    </TableCell>
                                    <TableCell>
                                        {getCurrencySymbol(currency)} {totalStake.toFixed(2)}
                                    </TableCell>
                                    <TableCell className={totalProfit > 0 ? "text-green-500" : "text-red-500"}>
                                        {getCurrencySymbol(currency)} {totalProfit.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                        <p>* Los stakes se expresan en {currency === "USD" ? "dólares ($)" : "soles (S/)"}</p>
                        <p>* La ganancia potencial se calcula en base a los stakes seleccionados.</p>
                        <p>* Tipo de cambio actual: 1 USD = {exchangeRate.toFixed(2)} PEN</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
