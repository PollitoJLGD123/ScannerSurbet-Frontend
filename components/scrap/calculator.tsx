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

export function Calculator({ data, setIsCalculated, setDataSelect }: DataCalculator) {
    // Estado principal
    const [totalStake, setTotalStake] = useState(100)
    const [currency, setCurrency] = useState("")
    const [exchangeRate, setExchangeRate] = useState(3.7)
    const [showExchangeRateInput, setShowExchangeRateInput] = useState(false)

    // Extraer secciones (casas de apuestas) del objeto data
    const sections = useMemo(() => {
        return data?.sections?.slice(0, 2) || []
    }, [data])

    // Estados para las cuotas, stakes, ganancias y checkboxes
    const [odds, setOdds] = useState<number[]>([0, 0])
    const [stakes, setStakes] = useState<number[]>([0, 0])
    const [profits, setProfits] = useState<number[]>([0, 0])
    const [checked, setChecked] = useState<boolean[]>([false, false])

    // Estado para trackear cambios en la data
    const [dataId, setDataId] = useState<string>("")

    // Función para inicializar valores con nueva data
    const initializeWithData = useCallback(() => {
        if (sections.length === 0) return

        const newOdds = sections.map((section) => Number.parseFloat(section.odds))
        const initialTotalStake = 100
        
        // Calcular stakes iniciales si las odds son válidas
        let initialStakes = [0, 0]
        if (newOdds[0] > 0 && newOdds[1] > 0) {
            const cinv = 1 / newOdds[0] + 1 / newOdds[1]
            initialStakes = [
                Number.parseFloat((initialTotalStake / (newOdds[0] * cinv)).toFixed(2)),
                Number.parseFloat((initialTotalStake / (newOdds[1] * cinv)).toFixed(2))
            ]
        }

        // Resetear todos los estados
        setOdds(newOdds)
        setStakes(initialStakes)
        setTotalStake(initialTotalStake)
        setChecked([false, false])
        setProfits([0, 0])

        // Generar ID único para la data actual
        const newDataId = `${sections[0]?.event_name || ""}-${sections[0]?.odds || ""}-${sections[1]?.odds || ""}-${Date.now()}`
        setDataId(newDataId)
    }, [sections])

    // Función para calcular stakes y ganancias
    const calculateValues = useCallback((currentOdds: number[], currentTotalStake: number, currentChecked: boolean[], currentStakes: number[]) => {

        // Calcular Cinv (factor de inversión)
        const cinv = 1 / currentOdds[0] + 1 / currentOdds[1]
        const newStakes = [...currentStakes]

        // Si ningún check está marcado, calcular ambos stakes normalmente
        if (!currentChecked[0] && !currentChecked[1]) {
            newStakes[0] = Number.parseFloat((currentTotalStake / (currentOdds[0] * cinv)).toFixed(2))
            newStakes[1] = Number.parseFloat((currentTotalStake / (currentOdds[1] * cinv)).toFixed(2))
        }
        // Si check1 está marcado, stake1 no cambia, recalcular stake2
        else if (currentChecked[0] && !currentChecked[1]) {
            newStakes[1] = Number.parseFloat(((currentStakes[0] * currentOdds[0]) / currentOdds[1]).toFixed(2))
        }
        // Si check2 está marcado, stake2 no cambia, recalcular stake1
        else if (!currentChecked[0] && currentChecked[1]) {
            newStakes[0] = Number.parseFloat(((currentStakes[1] * currentOdds[1]) / currentOdds[0]).toFixed(2))
        }

        // Calcular ganancias
        const actualTotalStake = newStakes[0] + newStakes[1]
        const newProfits = [
            Number.parseFloat((newStakes[0] * currentOdds[0] - actualTotalStake).toFixed(2)),
            Number.parseFloat((newStakes[1] * currentOdds[1] - actualTotalStake).toFixed(2)),
        ]

        setTotalStake(Number(actualTotalStake.toFixed(2)))

        return { newStakes, newProfits }
    }, [])

    // Inicializar cuando cambia la data
    useEffect(() => {
        initializeWithData()
        setCurrency("USD")
    }, [initializeWithData])

    // Recalcular cuando cambian las cuotas, total stake o checkboxes
    useEffect(() => {
        const { newStakes, newProfits } = calculateValues(odds, totalStake, checked, stakes)
        setStakes(newStakes)
        setProfits(newProfits)
    }, [odds, totalStake, checked])

    // Actualizar values cuando cambia la moneda
    useEffect(() => {
        setTotalStake(convert(totalStake, currency))
        setStakes(stakes.map(stake => convert(stake, currency)))
    }, [currency])

    // Manejar cambios en las cuotas
    const handleOddsChange = useCallback((index: number, value: string) => {
        // Validar y actualizar estado solo si es un número válido
        const numValue = Number.parseFloat(value)
        if (!isNaN(numValue) && numValue > 0) {
            const newOdds = [...odds]
            newOdds[index] = numValue
            setOdds(newOdds)
        }
    }, [odds])

    // Manejar cambios en los stakes individuales
    const handleStakeChange = useCallback((index: number, value: string) => {
        // Validar y actualizar estado
        const numValue = Number.parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0) {
            const newStakes = [...stakes]
            newStakes[index] = numValue

            // Recalcular el otro stake para mantener la proporción solo si no está fijado
            if (odds[0] > 0 && odds[1] > 0) {
                const otherIndex = index === 0 ? 1 : 0
                if (!checked[otherIndex]) {
                    if (index === 0) {
                        newStakes[1] = Number.parseFloat(((numValue * odds[0]) / odds[1]).toFixed(2))
                    } else {
                        newStakes[0] = Number.parseFloat(((numValue * odds[1]) / odds[0]).toFixed(2))
                    }
                    
                }
            }
            setStakes(newStakes)
            // Actualizar total stake
            const newTotalStake = newStakes[0] + newStakes[1]
            setTotalStake(Number(newTotalStake.toFixed(2)))
        }
    }, [currency, exchangeRate, checked])

    // Manejar cambios en el total stake
    const handleTotalStakeChange = useCallback((value: string) => {
        // Validar y actualizar estado
        const numValue = Number.parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0) {
            //const actualValue = currency === "USD" ? numValue : numValue / exchangeRate
            setTotalStake(Number(numValue.toFixed(2)))
        }
    }, [])

    // Manejar cambios en los checkboxes
    const handleCheckChange = useCallback((index: number, value: boolean) => {
        const newChecked = [...checked]
        newChecked[index] = value
        setChecked(newChecked)
    }, [checked])

    // Función para resetear la calculadora manteniendo los odds originales
    const resetCalculator = useCallback(() => {
        initializeWithData()
    }, [initializeWithData])

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
    const convertCurrency = useCallback((amount: number, targetCurrency: string) => {
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
    }, [currency, exchangeRate])

    // Función para convertir valores entre monedas
    const convert = (amount: number, targetCurrency: string) => {
        // Convertir de USD a PEN
        if (targetCurrency === "PEN") {
            return amount * exchangeRate
        }
        // Convertir de PEN a USD
        if (targetCurrency === "USD") {
            return amount / exchangeRate
        }

        return amount
    }

    // Obtener símbolo de moneda
    const getCurrencySymbol = useCallback((currencyCode: string) => {
        return currencyCode === "USD" ? "$" : "S/"
    }, [])

    // Calcular ganancia total y porcentaje
    const { totalProfit, percentage } = useMemo(() => {
        const total = Number.parseFloat(((profits[0] + profits[1]) / 2).toFixed(2))
        const actualTotalStake = stakes[0] + stakes[1]
        const perc = actualTotalStake > 0 ? Number.parseFloat(((total * 100) / actualTotalStake).toFixed(2)) : 0
        
        return {
            totalProfit: total,
            percentage: perc
        }
    }, [profits, stakes])

    const resetAll = useCallback(() => {
        setOdds([0, 0])
        setStakes([0, 0])
        setProfits([0, 0])
        setChecked([false, false])
        setTotalStake(100)
        setDataId("")
        setIsCalculated(false)
        setDataSelect(null)
    }, [setIsCalculated, setDataSelect])

    return (
        <Card className="md:w-[590px] ml-4 sticky top-[70px] border shadow-md animate-in slide-in-from-right duration-300">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Calculadora de Surbets
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={resetAll} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {percentage.toFixed(2)}% de beneficio
                    </Badge>
                    <Badge variant="outline" className="bg-sky-500/20 text-primary border-sky-600">
                        {data?.header?.sportName || "Sport"}
                    </Badge>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{data?.sections?.[0]?.event_name || "Event"}</span>
                    <span className="text-sm text-muted-foreground">{data?.sections?.[0]?.score || data?.sections?.[0]?.date_game || "N/A"}</span>
                </div>
            </CardHeader>

            <CardContent>
                <div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <Tabs value={currency} onValueChange={handleCurrencyChange} className="w-full">
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

                    <div className="bg-card/50 rounded-lg p-4 border border-border/30 backdrop-blur-sm mt-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Stake Total</p>
                                <p className="text-xl font-bold">
                                    {getCurrencySymbol(currency)} {convertCurrency(totalStake, currency)}
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
                                    {getCurrencySymbol(currency)} {convertCurrency(totalProfit, currency).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {currency === "USD"
                                        ? `≈ S/ ${convertCurrency(totalProfit, "PEN").toFixed(2)}`
                                        : `≈ $ ${convertCurrency(totalProfit, "USD").toFixed(2)}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader className="text-center">
                                <TableRow className="text-center">
                                    <TableHead>Casa</TableHead>
                                    <TableHead>Apuesta</TableHead>
                                    <TableHead>Cuota</TableHead>
                                    <TableHead>Stake</TableHead>
                                    <TableHead>Fijar</TableHead>
                                    <TableHead>Ganancia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections.map((section, index) => (
                                    <TableRow key={`${dataId}-${index}`}>
                                        <TableCell className="font-medium">{section?.book_name || "Casa"}</TableCell>
                                        <TableCell className="text-xs">{section?.market || "Apuesta"}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={odds[index] || ""}
                                                onChange={(e) => handleOddsChange(index, e.target.value)}
                                                className="w-24 h-8 text-center"
                                                step="0.01"
                                                min="0.01"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span className="text-xs mr-1">{getCurrencySymbol(currency)}</span>
                                                <Input
                                                    type="number"
                                                    value={stakes[index] || ""}
                                                    onChange={(e) => handleStakeChange(index, e.target.value)}
                                                    className="w-24 h-8 text-center"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={checked[index] || false}
                                                onCheckedChange={(value) => handleCheckChange(index, !!value)}
                                            />
                                        </TableCell>
                                        <TableCell className={profits[index] > 0 ? "text-green-500" : "text-destructive"}>
                                            {getCurrencySymbol(currency)} {convertCurrency(profits[index] || 0, currency).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow className="font-bold bg-muted/30">
                                    <TableCell colSpan={3} className="text-right">
                                        Total:
                                    </TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        {getCurrencySymbol(currency)}
                                        <Input
                                            type="number"
                                            value={totalStake}
                                            onChange={(e) => handleTotalStakeChange(e.target.value)}
                                            className="w-24 h-8 text-center"
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className={totalProfit > 0 ? "text-green-500" : "text-destructive"}>
                                        {getCurrencySymbol(currency)} {convertCurrency(totalProfit, currency).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
                            onClick={resetCalculator}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Resetear
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground -mt-10 space-y-1">
                        <p>* Los stakes se expresan en {currency === "USD" ? "dólares ($)" : "soles (S/)"}</p>
                        <p>* La ganancia potencial se calcula en base a los stakes seleccionados.</p>
                        <p>* Tipo de cambio actual: 1 USD = {exchangeRate.toFixed(2)} PEN</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}