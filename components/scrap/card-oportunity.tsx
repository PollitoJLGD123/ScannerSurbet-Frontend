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
            <Card className="border border-destructive/30 bg-destructive/10 p-2 text-xs">
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
        if (!color) return "bg-card/50 border-border"

        // Extract percentage value to determine intensity
        const percentValue = header.percent ? Number.parseFloat(header.percent.replace("%", "")) : 0
        const intensity = Math.min(Math.max(percentValue / 10, 1), 3) // Scale between 1-3 based on percentage

        if (color.includes("34, 197, 94"))
            return `bg-green-500/5 hover:bg-green-500/${5 * intensity} border-green-500/${10 * intensity}`
        if (color.includes("59, 130, 246"))
            return `bg-primary/5 hover:bg-primary/${5 * intensity} border-primary/${10 * intensity}`
        if (color.includes("107, 114, 128")) return `bg-muted hover:bg-muted/80 border-muted`

        return "bg-card/50 hover:bg-card/80 border-border"
    }

    // Determinar el color del texto del porcentaje
    const getTextColor = (color: string) => {
        if (!color) return "text-foreground"
        if (color.includes("34, 197, 94")) return "text-green-500"
        if (color.includes("59, 130, 246")) return "text-primary"
        if (color.includes("107, 114, 128")) return "text-muted-foreground"
        return "text-foreground"
    }

    // Determinar el icono de flecha
    const getArrowIcon = (arrowClass: string) => {
        if (!arrowClass) return <ArrowUp className="h-3 w-3 text-muted-foreground" />
        return arrowClass.includes("down") ? (
            <ArrowDown className="h-3 w-3 text-destructive" />
        ) : (
            <ArrowUp className="h-3 w-3 text-green-500" />
        )
    }

    function selectData() {
        setDataSelect(data)
        setIsCalculated(true)
    }

    return (
        <Card className={`${getBgColor(header.percent_color)} transition-all duration-300 shadow-sm`}>
            <CardContent className="">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Badge variant="outline" className="text-xs py-0 h-5 bg-background/50 backdrop-blur-sm">
                                {header.sportName || "Sport"}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-0.5" />
                                {header.time || "N/A"}
                            </span>
                        </div>
                        {header.period && <span className="text-xs text-muted-foreground leading-tight">{header.period}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${getTextColor(header.percent_color)} font-bold text-base`}>
                            {header.percent || "0%"}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsRemove(true)}
                            className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={selectData}
                            className="h-7 w-7 text-primary/70 hover:text-primary hover:bg-primary/10"
                        >
                            <Calculator className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Separator className="my-1.5" />

                {sections.length > 0 ? (
                    <div className="space-y-1">
                        {sections.map((section, index) => {
                            if (!section) return null

                            return (
                                <div
                                    key={index}
                                    className="bg-background/40 dark:bg-muted/10 flex justify-between px-3 text-xs rounded-md "
                                >
                                    <div className="flex flex-col mb-1 items-center">
                                        <Badge variant="secondary" className="text-xs py-0 h-5 w-24 bg-secondary/30">
                                            {section.book_name || "Book"}
                                        </Badge>
                                        <span className="text-muted-foreground text-[10px]">
                                            {section.score ? section.score : section.date_game || "N/A"}
                                        </span>
                                    </div>

                                    <div className="max-w-[40%]">
                                        <span className="font-medium truncate block">{section.event_name || "Event"}</span>
                                        <div className="text-muted-foreground truncate text-[10px]">{section.league_name || "League"}</div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{section.market || "Market"}</span>
                                            <div className="flex items-center gap-0.5 bg-card px-1.5 py-0.5 rounded border border-border/30">
                                                {getArrowIcon(section.arrowClass)}
                                                <span className="font-bold">{section.odds || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-1 text-muted-foreground text-xs">
                        <p>No sections available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
