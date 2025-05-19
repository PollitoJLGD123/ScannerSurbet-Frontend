"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Clock, AlertCircle, Trash, Calculator } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DataFunctionCard } from "@/types/data.type"

export default function BettingOpportunityCard({ data, setDataSelect, setIsCalculated, setIsRemove}: DataFunctionCard) {
    // Check if data exists
    if (!data) {
        return (
            <Card className="border border-red-500/30 bg-red-500/10 p-2 text-xs">
                <div className="flex items-center justify-center gap-1 text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    <p>No data available</p>
                </div>
            </Card>
        )
    }

    const header = data.header || {}
    const sections = data.sections || []

    // Determinar el color de fondo basado en el porcentaje
    const getBgColor = (color:string) => {
        if (!color) return "bg-gray-700/30 border-gray-600/30"
        if (color.includes("34, 197, 94")) return "bg-green-500/10 border-green-500/30"
        if (color.includes("59, 130, 246")) return "bg-blue-500/10 border-blue-500/30"
        if (color.includes("107, 114, 128")) return "bg-gray-500/10 border-gray-500/30"
        return "bg-gray-700/30 border-gray-600/30"
    }

    // Determinar el color del texto del porcentaje
    const getTextColor = (color:string) => {
        if (!color) return "text-white"
        if (color.includes("34, 197, 94")) return "text-green-500"
        if (color.includes("59, 130, 246")) return "text-blue-500"
        if (color.includes("107, 114, 128")) return "text-gray-400"
        return "text-white"
    }

    // Determinar el icono de flecha
    const getArrowIcon = (arrowClass:string) => {
        if (!arrowClass) return <ArrowUp className="h-3 w-3 text-gray-400" />
        return arrowClass.includes("down") ? (
            <ArrowDown className="h-3 w-3 text-red-500" />
        ) : (
            <ArrowUp className="h-3 w-3 text-green-500" />
        )
    }

    function selectData() {
        setDataSelect(data)
        setIsCalculated(true)
    }

    return (
        <Card className={`${getBgColor(header.percent_color)} hover:shadow-md transition-all duration-300`}>
            <CardContent className="">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 mb-0.5">
                            <Badge variant="outline" className="text-xs py-0 h-5">
                                {header.sportName || "Sport"}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center">
                                <Clock className="h-3 w-3 mr-0.5" />
                                {header.time || "N/A"}
                            </span>
                        </div>
                        {header.period && <span className="text-xs text-gray-400 leading-tight">{header.period}</span>}
                    </div>
                    <div className={`${getTextColor(header.percent_color)} font-bold text-base flex gap-2`}>
                        <h1>{header.percent || "0%"}</h1>

                        <button onClick={() => setIsRemove(true)}  className="">
                            <Trash className="h-5 w-5 text-red-300 hover:text-red-600 transition-colors duration-200 cursor-pointer"/>
                        </button>
                        <button onClick={selectData}>
                            <Calculator className="h-5 w-5 text-gray-100 hover:text-gray-600 transition-colors duration-200 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <Separator className="my-1.5 bg-gray-700" />

                {sections.length > 0 ? (
                    <div>
                        {sections.map((section, index) => {
                            if (!section) return null

                            return (
                                <div key={index} className="bg-black/20 flex justify-between py-1 px-4 text-xs">
                                    <div className="flex flex-col mb-1 items-center">
                                        <Badge variant="secondary" className="text-xs py-0 h-5 w-24">
                                            {section.book_name || "Book"}
                                        </Badge>
                                        <span className="text-gray-400">{section.score ? section.score : section.date_game || "N/A"}</span>
                                    </div>

                                    <div>
                                        <span className="font-medium truncate max-w-[60%]">{section.event_name || "Event"}</span>
                                        <div className="text-gray-400 truncate">{section.league_name || "League"}</div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{section.market || "Market"}</span>
                                            <div className="flex items-center gap-0.5 bg-gray-800 px-1.5 py-0.5 rounded">
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
                    <div className="text-center py-1 text-gray-400 text-xs">
                        <p>No sections available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
