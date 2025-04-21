"use client"

import { useEvents, type Event } from "@/lib/data-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/pagination"

export default function Home() {
  const { events, isLoading, paginateEvents, getCategories } = useEvents()
  const [category, setCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 6

  // Obtenir les catégories
  const categories = useMemo(() => getCategories(), [getCategories])

  // Filtrer et trier les événements avec useMemo pour éviter les recalculs inutiles
  const sortedEvents = useMemo(() => {
    // Filtrer les événements
    const filtered = events.filter((event) => {
      if (category && category !== "all" && event.category !== category) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        )
      }
      return true
    })

    // Trier les événements
    return [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "capacity") {
        return b.remainingSeats - a.remainingSeats
      }
      return 0
    })
  }, [events, category, searchQuery, sortBy])

  // Paginer les événements
  const paginatedEvents = useMemo(() => {
    return paginateEvents(sortedEvents, currentPage, pageSize)
  }, [paginateEvents, sortedEvents, currentPage, pageSize])

  // Réinitialiser la page lorsque les filtres changent
  useEffect(() => {
    setCurrentPage(1)
  }, [category, searchQuery, sortBy])

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Événements à venir</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[200px]"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Titre</SelectItem>
              <SelectItem value="capacity">Places disponibles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedEvents.data.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Aucun événement trouvé</h2>
          <p className="text-muted-foreground mt-2">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedEvents.pagination.total}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48">
        <Image
          src={event.image || "/placeholder.svg?height=400&width=600"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2">{event.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formattedDate} à {event.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
        <div className="flex items-center gap-1 mt-4 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="mt-4">
          <Badge variant={event.remainingSeats > 0 ? "outline" : "destructive"}>
            {event.remainingSeats > 0 ? `${event.remainingSeats} places disponibles` : "Complet"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
