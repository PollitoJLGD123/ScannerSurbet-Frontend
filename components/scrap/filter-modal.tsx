"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, RotateCcw, Search } from 'lucide-react'
import type { Surebet } from "@/types/data.type"
import Houses from "@/samples/filters/houses.json"
import Sports from "@/samples/filters/sports.json"

interface FilterState {
    percentageMin: number
    percentageMax: number
    selectedSports: string[]
    selectedBookmakers: string[]
}

interface FilterModalProps {
    data: Surebet[]
    onFilterChange: (filteredData: Surebet[], filters: FilterState) => void
    children?: React.ReactNode;
    type?: "live" | "prematch"
}

export function FilterModal({ data, onFilterChange, children, type }: FilterModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        percentageMin: 0,
        percentageMax: 100,
        selectedSports: [],
        selectedBookmakers: [],
    })
    const [searchSport, setSearchSport] = useState("")
    const [searchBookmaker, setSearchBookmaker] = useState("")

    // Sample data - you can replace these with actual imports from your JSON files
    const sportsData = Sports

    const bookmakersData = type === "live" ? Houses[0] : Houses[1]

    interface BookMakerItem {
        name: string
    }

    // Get all unique bookmakers
    const allBookmakers = Array.from(
        new Set(
            (bookmakersData.items as BookMakerItem[]).map((item) => item.name)
        )
    ).sort()

    // Filter sports based on search
    const filteredSports = sportsData.filter((sport: { name: string }) =>
        sport.name.toLowerCase().includes(searchSport.toLowerCase()),
    )

    // Filter bookmakers based on search
    const filteredBookmakers = allBookmakers.filter((bookmaker) =>
        bookmaker.toLowerCase().includes(searchBookmaker.toLowerCase()),
    )

    // Apply filters to data
    const applyFilters = () => {
        let filteredData = [...data]

        // Filter by percentage
        filteredData = filteredData.filter((item) => {
            if (!item.header?.percent) return false
            const percentage = Number.parseFloat(item.header.percent.replace("%", ""))
            return percentage >= filters.percentageMin && percentage <= filters.percentageMax
        })

        // Filter by sports
        if (filters.selectedSports.length > 0) {
            filteredData = filteredData.filter((item) => {
                return filters.selectedSports.includes(item.header?.sportName || "")
            })
        }

        // Filter by bookmakers
        if (filters.selectedBookmakers.length > 0) {
            filteredData = filteredData.filter((item) => {
                if (!item.sections) return false
                return item.sections.some((section) => filters.selectedBookmakers.includes(section.book_name || ""))
            })
        }

        onFilterChange(filteredData, filters)
        setIsOpen(false)
    }

    // Reset filters
    const resetFilters = () => {
        const resetFilterState = {
            percentageMin: 0,
            percentageMax: 100,
            selectedSports: [],
            selectedBookmakers: [],
        }
        setFilters(resetFilterState)
        setSearchSport("")
        setSearchBookmaker("")
        onFilterChange(data, resetFilterState)
    }
    // Handle sport selection
    const handleSportToggle = (sportName: string) => {
        setFilters((prev) => ({
            ...prev,
            selectedSports: prev.selectedSports.includes(sportName)
                ? prev.selectedSports.filter((s) => s !== sportName)
                : [...prev.selectedSports, sportName],
        }))
    }

    // Handle bookmaker selection
    const handleBookmakerToggle = (bookmakerName: string) => {
        setFilters((prev) => ({
            ...prev,
            selectedBookmakers: prev.selectedBookmakers.includes(bookmakerName)
                ? prev.selectedBookmakers.filter((b) => b !== bookmakerName)
                : [...prev.selectedBookmakers, bookmakerName],
        }))
    }

    // Get active filters count
    const getActiveFiltersCount = () => {
        let count = 0
        if (filters.percentageMin > 0 || filters.percentageMax < 100) count++
        if (filters.selectedSports.length > 0) count++
        if (filters.selectedBookmakers.length > 0) count++
        return count
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="flex items-center gap-2 h-8 text-xs relative">
                        <Filter className="h-3 w-3" />
                        <span>Filtros</span>
                        {getActiveFiltersCount() > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Filtros Avanzados
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Personaliza tu búsqueda de oportunidades de arbitraje deportivo
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="percentage" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="percentage">Porcentaje</TabsTrigger>
                        <TabsTrigger value="sports">Deportes</TabsTrigger>
                        <TabsTrigger value="bookmakers">Casas de Apuestas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="percentage" className="space-y-4">
                        <div className="bg-card/50 rounded-lg p-4 border border-border/30 backdrop-blur-sm">
                            <Label className="text-base font-semibold mb-4 block">Rango de Porcentaje de Beneficio</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="min-percentage">Mínimo (%)</Label>
                                    <Input
                                        id="min-percentage"
                                        type="number"
                                        value={filters.percentageMin}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                percentageMin: Number.parseFloat(e.target.value) || 0,
                                            }))
                                        }
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-percentage">Máximo (%)</Label>
                                    <Input
                                        id="max-percentage"
                                        type="number"
                                        value={filters.percentageMax}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                percentageMax: Number.parseFloat(e.target.value) || 100,
                                            }))
                                        }
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-primary/10 rounded-md">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando surebets con beneficio entre{" "}
                                    <span className="font-semibold text-primary">{filters.percentageMin}%</span> y{" "}
                                    <span className="font-semibold text-primary">{filters.percentageMax}%</span>
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sports" className="space-y-4">
                        <div className="bg-card/50 rounded-lg p-4 border border-border/30 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-base font-semibold">Deportes</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters((prev) => ({ ...prev, selectedSports: [] }))}
                                    >
                                        Limpiar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                selectedSports: sportsData.map((sport) => sport.name),
                                            }))
                                        }
                                    >
                                        Seleccionar Todo
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar deportes..."
                                    value={searchSport}
                                    onChange={(e) => setSearchSport(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <ScrollArea className="h-64">
                                <div className="grid grid-cols-2 gap-2">
                                    {filteredSports.map((sport) => (
                                        <div key={sport.name} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                            <Checkbox
                                                id={`sport-${sport.name}`}
                                                checked={filters.selectedSports.includes(sport.name)}
                                                onCheckedChange={() => handleSportToggle(sport.name)}
                                            />
                                            <Label htmlFor={`sport-${sport.name}`} className="text-sm cursor-pointer">
                                                {sport.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>

                    <TabsContent value="bookmakers" className="space-y-4">
                        <div className="bg-card/50 rounded-lg p-4 border border-border/30 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <Label className="text-base font-semibold">Casas de Apuestas</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters((prev) => ({ ...prev, selectedBookmakers: [] }))}
                                    >
                                        Limpiar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                selectedBookmakers: allBookmakers,
                                            }))
                                        }
                                    >
                                        Seleccionar Todo
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar casas de apuestas..."
                                    value={searchBookmaker}
                                    onChange={(e) => setSearchBookmaker(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <ScrollArea className="h-64">
                                <div className="grid grid-cols-3 gap-2">
                                    {filteredBookmakers.map((bookmaker) => (
                                        <div key={bookmaker} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                                            <Checkbox
                                                id={`bookmaker-${bookmaker}`}
                                                checked={filters.selectedBookmakers.includes(bookmaker)}
                                                onCheckedChange={() => handleBookmakerToggle(bookmaker)}
                                            />
                                            <Label htmlFor={`bookmaker-${bookmaker}`} className="text-xs cursor-pointer">
                                                {bookmaker}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Resetear Filtros
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90">
                            Aplicar Filtros
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
