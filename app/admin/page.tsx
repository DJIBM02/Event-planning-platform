"use client"

import { useAuth } from "@/lib/auth-context"
import { useEvents, useReservations } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Trash2, Edit, Plus, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useMemo } from "react"
import { Pagination } from "@/components/pagination"

export default function AdminPage() {
  const { user } = useAuth()
  const { events, deleteEvent, paginateEvents } = useEvents()
  const { reservations, paginateReservations } = useReservations()
  const { toast } = useToast()
  const router = useRouter()
  const [currentEventsPage, setCurrentEventsPage] = useState<number>(1)
  const [currentReservationsPage, setCurrentReservationsPage] = useState<number>(1)
  const pageSize = 10
  const isAdmin = user?.role === "admin"

  // Paginer les événements et les réservations une seule fois
  const paginatedEvents = useMemo(() => {
    return paginateEvents(events, currentEventsPage, pageSize)
  }, [paginateEvents, events, currentEventsPage, pageSize])

  const paginatedReservations = useMemo(() => {
    return paginateReservations(reservations, currentReservationsPage, pageSize)
  }, [paginateReservations, reservations, currentReservationsPage, pageSize])

  // Calculer le taux de remplissage correctement
  const occupancyRate = useMemo(() => {
    if (events.length === 0) return 0

    const totalCapacity = events.reduce((acc, event) => acc + event.capacity, 0)
    const totalReservations = events.reduce((acc, event) => acc + (event.capacity - event.remainingSeats), 0)

    return Math.round((totalReservations / totalCapacity) * 100)
  }, [events])

  const handleDeleteEvent = (id: string, title: string) => {
    deleteEvent(id)
    toast({
      title: "Événement supprimé",
      description: `L'événement "${title}" a été supprimé avec succès.`,
      variant: "success",
    })
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground mb-4">Vous n'avez pas les droits d'accès à cette page.</p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" /> Nouvel événement
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des réservations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de remplissage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des événements</CardTitle>
              <CardDescription>Gérez les événements de votre plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun événement disponible</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Lieu</TableHead>
                          <TableHead>Capacité</TableHead>
                          <TableHead>Places restantes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEvents.data.map((event) => {
                          const eventDate = new Date(event.date)
                          const formattedDate = eventDate.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })

                          return (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.title}</TableCell>
                              <TableCell>
                                {formattedDate} à {event.time}
                              </TableCell>
                              <TableCell>{event.location}</TableCell>
                              <TableCell>{event.capacity}</TableCell>
                              <TableCell>
                                <Badge variant={event.remainingSeats > 0 ? "outline" : "destructive"}>
                                  {event.remainingSeats}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="icon" asChild>
                                    <Link href={`/admin/events/edit/${event.id}`}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Modifier</span>
                                    </Link>
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Supprimer</span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Confirmer la suppression</DialogTitle>
                                        <DialogDescription>
                                          Êtes-vous sûr de vouloir supprimer l'événement "{event.title}" ? Cette action
                                          est irréversible.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleDeleteEvent(event.id, event.title)}
                                        >
                                          Supprimer
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4">
                    <Pagination
                      currentPage={currentEventsPage}
                      totalPages={paginatedEvents.pagination.total}
                      onPageChange={setCurrentEventsPage}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des réservations</CardTitle>
              <CardDescription>Consultez toutes les réservations</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune réservation disponible</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Événement</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Date de réservation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedReservations.data.map((reservation) => {
                          const reservationDate = new Date(reservation.reservationDate)
                          const formattedDate = reservationDate.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })

                          return (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">{reservation.eventTitle}</TableCell>
                              <TableCell>{reservation.userName}</TableCell>
                              <TableCell>{formattedDate}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4">
                    <Pagination
                      currentPage={currentReservationsPage}
                      totalPages={paginatedReservations.pagination.total}
                      onPageChange={setCurrentReservationsPage}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
