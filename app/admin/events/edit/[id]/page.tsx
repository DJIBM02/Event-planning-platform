"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useEvents } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initialEvents } from "@/lib/initial-data"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { getEventById, updateEvent, getCategories, resetEvents, isInitialized } = useEvents()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const categories = getCategories()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: 0,
    remainingSeats: 0,
    category: "",
    image: "",
  })

  // Charger les données de l'événement
  useEffect(() => {
    const loadEvent = () => {
      try {
        // Assurez-vous que l'ID est une chaîne de caractères
        const eventId = String(params.id)
        console.log("Chargement de l'événement avec ID:", eventId)

        // Essayer de trouver l'événement
        let event = getEventById(eventId)

        // Si l'événement n'est pas trouvé et que nous utilisons les données initiales
        if (!event) {
          console.log("Événement non trouvé, recherche dans les données initiales")
          event = initialEvents.find((e) => String(e.id) === eventId)

          if (event) {
            console.log("Événement trouvé dans les données initiales")
            // Si les événements ont été réinitialisés ou corrompus, les réinitialiser
            resetEvents()
          }
        }

        if (event) {
          console.log("Événement trouvé:", event)
          setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            capacity: event.capacity,
            remainingSeats: event.remainingSeats,
            category: event.category,
            image: event.image || "/placeholder.svg?height=400&width=600",
          })
          setIsLoading(false)
        } else {
          console.error("Événement non trouvé pour l'ID:", eventId)
          toast({
            title: "Erreur",
            description: "Événement non trouvé. Retour à la liste des événements.",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error)
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors du chargement de l'événement",
          variant: "destructive",
        })
        router.push("/admin")
      }
    }

    // Attendre que les événements soient initialisés avant de charger
    if (isInitialized) {
      loadEvent()
    } else {
      // Essayer de charger après un court délai si les événements ne sont pas encore initialisés
      const timer = setTimeout(() => {
        loadEvent()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [params.id, getEventById, toast, router, resetEvents, isInitialized])

  // Vérifier si l'utilisateur est un administrateur
  if (!user || user.role !== "admin") {
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "capacity" || name === "remainingSeats" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation de base
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.capacity ||
      !formData.category
    ) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // Vérifier que les places restantes ne dépassent pas la capacité
    if (formData.remainingSeats > formData.capacity) {
      toast({
        title: "Erreur de validation",
        description: "Le nombre de places restantes ne peut pas dépasser la capacité totale.",
        variant: "destructive",
      })
      return
    }

    try {
      // Mettre à jour l'événement
      updateEvent(params.id, formData)

      toast({
        title: "Événement mis à jour",
        description: `L'événement "${formData.title}" a été mis à jour avec succès.`,
        variant: "success",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de l'événement",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
          &larr; Retour à l'administration
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modifier l'événement</CardTitle>
          <CardDescription>Modifiez les informations de l'événement</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remainingSeats">Places restantes *</Label>
                <Input
                  id="remainingSeats"
                  name="remainingSeats"
                  type="number"
                  min="0"
                  max={formData.capacity}
                  value={formData.remainingSeats}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    {!categories.includes(formData.category) && formData.category && (
                      <SelectItem value={formData.category}>{formData.category}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image (optionnel)</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin">Annuler</Link>
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
