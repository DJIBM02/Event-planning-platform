"use client"

import { useAuth } from "@/lib/auth-context"
import { useReservations, useEvents } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Pagination } from "@/components/pagination"

export default function ReservationsPage() {
  const { user } = useAuth()
  const { getUserReservations, cancelReservation, paginateReservations } = useReservations()
  const { getEventById } = useEvents()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 6
  const [userReservations, setUserReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fonction stable pour charger les réservations
  const loadUserReservations = useCallback(() => {
    if (user) {
      const reservations = getUserReservations(user.id)
      setUserReservations(reservations)
    } else {
      setUserReservations([])
    }
    setIsLoading(false)
  }, [user, getUserReservations])

  // Charger les réservations de l'utilisateur une seule fois au chargement
  // ou lorsque l'utilisateur change
  useEffect(() => {
    loadUserReservations()
  }, [loadUserReservations])

  // Paginer les réservations
  const paginatedReservations = useMemo(() => {
    return paginateReservations(userReservations, currentPage, pageSize)
  }, [paginateReservations, userReservations, currentPage, pageSize])

  const handleCancelReservation = (id: string, eventTitle: string) => {
    const success = cancelReservation(id)
    if (success) {
      // Mettre à jour la liste des réservations après annulation
      loadUserReservations()

      toast({
        title: "Réservation annulée",
        description: `Votre réservation pour "${eventTitle}" a été annulée.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler cette réservation.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir vos réservations.</p>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mes réservations</h1>

      {paginatedReservations.data.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Aucune réservation</h2>
          <p className="text-muted-foreground mt-2 mb-6">Vous n'avez pas encore réservé de place pour un événement.</p>
          <Button asChild>
            <Link href="/">Découvrir les événements</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedReservations.data.map((reservation) => {
              const event = getEventById(reservation.eventId)
              if (!event) return null

              const eventDate = new Date(event.date)
              const formattedDate = eventDate.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })

              const reservationDate = new Date(reservation.reservationDate)
              const formattedReservationDate = reservationDate.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })

              return (
                <Card key={reservation.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>Réservé le {formattedReservationDate}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/events/${event.id}`}>Détails</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => handleCancelReservation(reservation.id, event.title)}>
                      Annuler
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedReservations.pagination.total}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}
