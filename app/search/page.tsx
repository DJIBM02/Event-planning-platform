"use client"

import { useSearchParams } from "next/navigation"
import { useEvents, type Event } from "@/lib/data-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { Pagination } from "@/components/pagination"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { searchEvents, isLoading, paginateEvents } = useEvents()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 6

  // Effectuer la recherche une seule fois
  const searchResults = useMemo(() => {
    return query ? searchEvents(query) : []
  }, [query, searchEvents])

  // Paginer les résultats
  const paginatedResults = useMemo(() => {
    return paginateEvents(searchResults, currentPage, pageSize)
  }, [paginateEvents, searchResults, currentPage, pageSize])

  // Réinitialiser la page lorsque la requête change
  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Résultats de recherche</h1>
        <p className="text-muted-foreground mt-2">
          {searchResults.length} résultat(s) pour "{query}"
        </p>
      </div>

      {paginatedResults.data.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Aucun événement trouvé</h2>
          <p className="text-muted-foreground mt-2 mb-6">Essayez avec d'autres termes de recherche</p>
          <Button asChild>
            <Link href="/">Voir tous les événements</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedResults.pagination.total}
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
