"use client"

import { useEvents, useReservations } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

export default function EventPage({ params }: { params: { id: string } }) {
  const { getEventById } = useEvents()
  const { addReservation } = useReservations()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const foundEvent = getEventById(params.id)
      if (foundEvent) {
        setEvent(foundEvent)
      } else {
        setError(true)
      }
    } catch (e) {
      console.error("Erreur lors du chargement de l'événement:", e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [params.id, getEventById])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
        <Button asChild>
          <Link href="/">Retour aux événements</Link>
        </Button>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handleReservation = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver une place.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (event.remainingSeats <= 0) {
      toast({
        title: "Événement complet",
        description: "Il n'y a plus de places disponibles pour cet événement.",
        variant: "destructive",
      })
      return
    }

    const success = addReservation(event.id, user.id, user.name)
    if (success) {
      toast({
        title: "Réservation confirmée",
        description: `Vous avez réservé une place pour "${event.title}".`,
        variant: "success",
      })
    } else {
      toast({
        title: "Erreur de réservation",
        description: "Impossible de réserver une place pour cet événement.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          &larr; Retour aux événements
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={event.image || "/placeholder.svg?height=400&width=600"}
              alt={event.title}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2">{event.category}</Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Réservation</CardTitle>
              <CardDescription>Réservez votre place maintenant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Prix</span>
                  <span className="font-semibold">Gratuit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capacité</span>
                  <span>{event.capacity} places</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Places restantes</span>
                  <Badge variant={event.remainingSeats > 0 ? "outline" : "destructive"}>
                    {event.remainingSeats > 0 ? event.remainingSeats : "Complet"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReservation} disabled={event.remainingSeats <= 0} className="w-full">
                {event.remainingSeats > 0 ? "Réserver une place" : "Événement complet"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
