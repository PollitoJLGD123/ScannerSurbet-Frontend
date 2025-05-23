"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Clock, AlertCircle, Trash, Calculator } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { DataFunctionCard } from "@/types/data.type"

export default function BettingOpportunityCard({
    data,
    setDataSelect,
    setIsCalculated,
    setIsRemove,
}: DataFunctionCard) {
    // Check if data exists
    if (!data) {
        return (
            <Card className="border-2 border-destructive bg-destructive/20 p-2 text-xs shadow-md">
                <div className="flex items-center justify-center gap-1 text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <p>No data available</p>
                </div>
            </Card>
        )
    }

    const header = data.header || {}
    const sections = data.sections || []

    // Determinar el color de fondo basado en el porcentaje
    const getBgColor = (color: string) => {
        if (!color) return "bg-card border-border shadow-md"

        // Extract percentage value to determine intensity
        const percentValue = header.percent ? Number.parseFloat(header.percent.replace("%", "")) : 0

        // Higher base opacity and more dramatic scaling for better visibility
        if (color.includes("34, 197, 94")) {
            // Green - high percentage
            if (percentValue >= 5) {
                return "bg-green-100 dark:bg-green-900/40 border-green-500 shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
            } else {
                return "bg-green-50 dark:bg-green-900/30 border-green-400 shadow-sm hover:shadow-green-200/30 dark:hover:shadow-green-900/30"
            }
        }

        if (color.includes("59, 130, 246")) {
            // Blue - medium percentage
            if (percentValue >= 3) {
                return "bg-blue-100 dark:bg-blue-900/40 border-blue-500 shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
            } else {
                return "bg-blue-50 dark:bg-blue-900/30 border-blue-400 shadow-sm hover:shadow-blue-200/30 dark:hover:shadow-blue-900/30"
            }
        }

        if (color.includes("107, 114, 128")) {
            // Gray - low percentage
            return "bg-gray-100 dark:bg-gray-800/60 border-gray-400 shadow-sm hover:shadow-gray-200/30 dark:hover:shadow-gray-800/30"
        }

        return "bg-card border-border shadow-sm hover:shadow"
    }

    // Determinar el color del texto del porcentaje
    const getTextColor = (color: string) => {
        if (!color) return "text-foreground"
        if (color.includes("34, 197, 94")) return "text-green-600 dark:text-green-400 font-bold"
        if (color.includes("59, 130, 246")) return "text-blue-600 dark:text-blue-400 font-bold"
        if (color.includes("107, 114, 128")) return "text-gray-700 dark:text-gray-300"
        return "text-foreground"
    }

    // Determinar el icono de flecha
    const getArrowIcon = (arrowClass: string) => {
        if (!arrowClass) return <ArrowUp className="h-3 w-3 text-gray-500" />
        return arrowClass.includes("down") ? (
            <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
        ) : (
            <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />
        )
    }

    function selectData() {
        setDataSelect(data)
        setIsCalculated(true)
    }

    return (
        <Card className={`${getBgColor(header.percent_color)} transition-all duration-300 border h-[150px]`}>
            <CardContent className="">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Badge
                                variant="outline"
                                className="text-xs py-0 h-5 bg-background/80 dark:bg-background/30 backdrop-blur-sm border-border/50 font-medium"
                            >
                                {header.sportName || "Sport"}
                            </Badge>
                            <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                                <Clock className="h-3 w-3 mr-0.5" />
                                {header.time || "N/A"}
                            </span>
                        </div>
                        {header.period && (
                            <span className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{header.period}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${getTextColor(header.percent_color)} text-base`}>{header.percent || "0%"}</span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsRemove(true)}
                            className="h-7 w-7 text-red-500/80 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={selectData}
                            className="h-7 w-7 text-blue-500/80 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                        >
                            <Calculator className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Separator className="my-1.5 bg-border/50" />

                {sections.length > 0 ? (
                    <div className="space-y-1">
                        {sections.map((section, index) => {
                            if (!section) return null

                            return (
                                <div
                                    key={index}
                                    className="bg-white/70 dark:bg-gray-800/70 flex justify-between px-3 text-xs rounded-md border border-border/30"
                                >
                                    <div className="flex flex-col mb-1 items-center">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs py-0 h-5 w-24 bg-secondary/50 dark:bg-secondary/30 font-medium"
                                        >
                                            {section.book_name || "Book"}
                                        </Badge>
                                        <span className="text-gray-600 dark:text-gray-400 text-[10px]">
                                            {section.score ? section.score : section.date_game || "N/A"}
                                        </span>
                                    </div>

                                    <div className="max-w-[40%]">
                                        <span className="font-medium truncate block text-gray-800 dark:text-gray-200">
                                            {section.event_name || "Event"}
                                        </span>
                                        <div className="text-gray-600 dark:text-gray-400 truncate text-[10px]">
                                            {section.league_name || "League"}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{section.market || "Market"}</span>
                                            <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600">
                                                {getArrowIcon(section.arrowClass)}
                                                <span className="font-bold text-gray-800 dark:text-gray-200">{section.odds || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-1 text-gray-600 dark:text-gray-400 text-xs">
                        <p>No sections available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
