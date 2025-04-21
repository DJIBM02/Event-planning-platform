"use client"

import { useEffect, useState, useCallback } from "react"

// Types pour les événements et réservations
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  remainingSeats: number
  category: string
  image?: string
}

export interface Reservation {
  id: string
  eventId: string
  userId: string
  userName: string
  reservationDate: string
  eventTitle: string
}

// Interface pour les options de pagination
export interface PaginationOptions {
  page: number
  pageSize: number
  total: number
}

// Interface pour les résultats paginés
export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationOptions
}

// Données initiales pour les événements
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Conférence Tech 2024",
    description: "Une conférence sur les dernières tendances technologiques et l'innovation.",
    date: "2024-06-15",
    time: "09:00",
    location: "Centre des Congrès, Paris",
    capacity: 200,
    remainingSeats: 150,
    category: "Technologie",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    title: "Concert de Jazz",
    description: "Un concert de jazz avec des artistes internationaux renommés.",
    date: "2024-07-20",
    time: "20:00",
    location: "Salle Pleyel, Paris",
    capacity: 500,
    remainingSeats: 200,
    category: "Musique",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    title: "Atelier de Cuisine",
    description: "Apprenez à cuisiner des plats gastronomiques avec un chef étoilé.",
    date: "2024-06-30",
    time: "14:00",
    location: "École de Cuisine, Lyon",
    capacity: 20,
    remainingSeats: 5,
    category: "Gastronomie",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "4",
    title: "Exposition d'Art Contemporain",
    description: "Découvrez les œuvres d'artistes contemporains émergents.",
    date: "2024-08-10",
    time: "10:00",
    location: "Galerie Moderne, Marseille",
    capacity: 100,
    remainingSeats: 80,
    category: "Art",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "5",
    title: "Séminaire sur le Développement Durable",
    description: "Discussions et ateliers sur les pratiques durables pour les entreprises.",
    date: "2024-09-05",
    time: "09:30",
    location: "Centre d'Affaires, Bordeaux",
    capacity: 150,
    remainingSeats: 100,
    category: "Environnement",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "6",
    title: "Festival de Cinéma",
    description: "Projections de films indépendants et rencontres avec des réalisateurs.",
    date: "2024-10-15",
    time: "18:00",
    location: "Cinémathèque, Nice",
    capacity: 300,
    remainingSeats: 250,
    category: "Cinéma",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "7",
    title: "Salon du Livre",
    description: "Rencontrez vos auteurs préférés et découvrez les nouveautés littéraires.",
    date: "2024-11-20",
    time: "10:00",
    location: "Palais des Congrès, Lille",
    capacity: 500,
    remainingSeats: 400,
    category: "Littérature",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "8",
    title: "Marathon de Paris",
    description: "Participez à la course mythique à travers les rues de la capitale.",
    date: "2024-04-07",
    time: "08:00",
    location: "Champs-Élysées, Paris",
    capacity: 1000,
    remainingSeats: 200,
    category: "Sport",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "9",
    title: "Conférence sur l'Intelligence Artificielle",
    description: "Explorez les dernières avancées en matière d'IA et leurs applications.",
    date: "2024-08-25",
    time: "14:00",
    location: "École Polytechnique, Paris",
    capacity: 250,
    remainingSeats: 150,
    category: "Technologie",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "10",
    title: "Exposition Florale",
    description: "Admirez les plus belles compositions florales et plantes exotiques.",
    date: "2024-05-10",
    time: "09:00",
    location: "Jardin Botanique, Nantes",
    capacity: 200,
    remainingSeats: 180,
    category: "Nature",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "11",
    title: "Dégustation de Vins",
    description: "Découvrez les meilleurs crus de la région en compagnie d'œnologues experts.",
    date: "2024-09-30",
    time: "19:00",
    location: "Château Viticole, Bordeaux",
    capacity: 50,
    remainingSeats: 20,
    category: "Gastronomie",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "12",
    title: "Concert Symphonique",
    description: "Un concert exceptionnel avec l'orchestre philharmonique de la ville.",
    date: "2024-12-15",
    time: "20:00",
    location: "Opéra Garnier, Paris",
    capacity: 400,
    remainingSeats: 150,
    category: "Musique",
    image: "/placeholder.svg?height=400&width=600",
  },
]

// Hook pour gérer les événements
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Charger les événements depuis le localStorage au chargement
  useEffect(() => {
    const loadEvents = () => {
      try {
        // Vérifier si les événements sont déjà chargés
        if (events.length > 0) {
          setIsInitialized(true)
          return
        }

        // Essayer de charger depuis localStorage
        const storedEvents = localStorage.getItem("events")

        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents)
          console.log("Événements chargés depuis localStorage:", parsedEvents.length)
          setEvents(parsedEvents)
          setCategories(Array.from(new Set(parsedEvents.map((event: Event) => event.category))))
        } else {
          // Si aucun événement n'est stocké, utiliser les événements initiaux
          console.log("Aucun événement trouvé dans localStorage, utilisation des événements initiaux")
          setEvents(initialEvents)
          setCategories(Array.from(new Set(initialEvents.map((event) => event.category))))

          // Sauvegarder les événements initiaux dans localStorage
          localStorage.setItem("events", JSON.stringify(initialEvents))
        }

        setIsInitialized(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error)
        // En cas d'erreur, utiliser les événements initiaux
        setEvents(initialEvents)
        setCategories(Array.from(new Set(initialEvents.map((event) => event.category))))
        setIsInitialized(true)
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [events.length])

  // Sauvegarder les événements dans le localStorage à chaque modification
  useEffect(() => {
    if (!isLoading && isInitialized && events.length > 0) {
      try {
        localStorage.setItem("events", JSON.stringify(events))
        console.log("Événements sauvegardés dans localStorage:", events.length)

        // Mettre à jour les catégories lorsque les événements changent
        const newCategories = Array.from(new Set(events.map((event) => event.category)))
        if (JSON.stringify(newCategories) !== JSON.stringify(categories)) {
          setCategories(newCategories)
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des événements:", error)
      }
    }
  }, [events, isLoading, categories, isInitialized])

  // Fonction pour ajouter un événement
  const addEvent = useCallback((event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      remainingSeats: event.capacity,
    }
    setEvents((prevEvents) => [...prevEvents, newEvent])
    return newEvent
  }, [])

  // Fonction pour mettre à jour un événement
  const updateEvent = useCallback((id: string, updatedEvent: Partial<Event>) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)))
  }, [])

  // Fonction pour supprimer un événement
  const deleteEvent = useCallback((id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
  }, [])

  // Fonction pour obtenir un événement par son ID
  const getEventById = useCallback(
    (id: string) => {
      if (!id) {
        console.error("getEventById appelé avec un ID vide ou null")
        return null
      }

      // Assurez-vous que l'ID est une chaîne de caractères
      const eventId = String(id)
      console.log(`Recherche de l'événement avec ID: ${eventId}`)

      // Si les événements ne sont pas encore chargés, utiliser les événements initiaux
      const eventsToSearch = events.length > 0 ? events : initialEvents
      console.log(`Nombre d'événements disponibles: ${eventsToSearch.length}`)

      // Rechercher l'événement par ID
      const event = eventsToSearch.find((event) => String(event.id) === eventId)

      if (!event) {
        console.error(`Aucun événement trouvé avec l'ID: ${eventId}`)
        console.log("IDs disponibles:", eventsToSearch.map((e) => e.id).join(", "))

        // Essayer de charger directement depuis les événements initiaux
        const initialEvent = initialEvents.find((event) => String(event.id) === eventId)
        if (initialEvent) {
          console.log("Événement trouvé dans les données initiales:", initialEvent)
          return initialEvent
        }
      } else {
        console.log(`Événement trouvé:`, event)
      }

      return event || null
    },
    [events],
  )

  // Fonction pour rechercher des événements
  const searchEvents = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return events.filter(
        (event) =>
          event.title.toLowerCase().includes(lowercaseQuery) ||
          event.description.toLowerCase().includes(lowercaseQuery) ||
          event.location.toLowerCase().includes(lowercaseQuery) ||
          event.category.toLowerCase().includes(lowercaseQuery),
      )
    },
    [events],
  )

  // Fonction pour filtrer les événements
  const filterEvents = useCallback(
    ({ category, date, location }: { category?: string; date?: string; location?: string }) => {
      return events.filter((event) => {
        let match = true
        if (category && category !== "all" && event.category !== category) match = false
        if (date && event.date !== date) match = false
        if (location && !event.location.includes(location)) match = false
        return match
      })
    },
    [events],
  )

  // Fonction pour paginer les événements
  const paginateEvents = useCallback((eventsList: Event[], page = 1, pageSize = 6): PaginatedResult<Event> => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = eventsList.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: Math.ceil(eventsList.length / pageSize),
      },
    }
  }, [])

  // Fonction pour obtenir toutes les catégories uniques
  const getCategories = useCallback(() => {
    return categories
  }, [categories])

  // Fonction pour réinitialiser les événements aux valeurs initiales
  const resetEvents = useCallback(() => {
    setEvents(initialEvents)
    localStorage.setItem("events", JSON.stringify(initialEvents))
    setCategories(Array.from(new Set(initialEvents.map((event) => event.category))))
    console.log("Événements réinitialisés aux valeurs initiales")
  }, [])

  return {
    events: isInitialized ? events : initialEvents,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    searchEvents,
    filterEvents,
    paginateEvents,
    getCategories,
    resetEvents,
    isInitialized,
  }
}

// Hook pour gérer les réservations
export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { events, updateEvent } = useEvents()

  // Charger les réservations depuis le localStorage au chargement
  useEffect(() => {
    const loadReservations = () => {
      const storedReservations = localStorage.getItem("reservations")
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations))
      } else {
        setReservations([])
      }
      setIsLoading(false)
    }

    loadReservations()
  }, [])

  // Sauvegarder les réservations dans le localStorage à chaque modification
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("reservations", JSON.stringify(reservations))
    }
  }, [reservations, isLoading])

  // Fonction pour ajouter une réservation
  const addReservation = useCallback(
    (eventId: string, userId: string, userName: string) => {
      // Vérifier si l'événement existe et a des places disponibles
      const event = events.find((e) => e.id === eventId)
      if (!event || event.remainingSeats <= 0) {
        return false
      }

      // Créer la réservation
      const newReservation: Reservation = {
        id: Date.now().toString(),
        eventId,
        userId,
        userName,
        reservationDate: new Date().toISOString(),
        eventTitle: event.title,
      }

      // Mettre à jour le nombre de places restantes
      updateEvent(eventId, {
        remainingSeats: event.remainingSeats - 1,
      })

      // Ajouter la réservation
      setReservations((prevReservations) => [...prevReservations, newReservation])
      return true
    },
    [events, updateEvent],
  )

  // Fonction pour annuler une réservation
  const cancelReservation = useCallback(
    (id: string) => {
      const reservation = reservations.find((r) => r.id === id)
      if (!reservation) return false

      // Mettre à jour le nombre de places restantes
      const event = events.find((e) => e.id === reservation.eventId)
      if (event) {
        updateEvent(reservation.eventId, {
          remainingSeats: event.remainingSeats + 1,
        })
      }

      // Supprimer la réservation
      setReservations((prevReservations) => prevReservations.filter((r) => r.id !== id))
      return true
    },
    [reservations, events, updateEvent],
  )

  // Fonction pour obtenir les réservations d'un utilisateur
  const getUserReservations = useCallback(
    (userId: string) => {
      return reservations.filter((r) => r.userId === userId)
    },
    [reservations],
  )

  // Fonction pour obtenir les réservations d'un événement
  const getEventReservations = useCallback(
    (eventId: string) => {
      return reservations.filter((r) => r.eventId === eventId)
    },
    [reservations],
  )

  // Fonction pour paginer les réservations
  const paginateReservations = useCallback(
    (reservationsList: Reservation[], page = 1, pageSize = 6): PaginatedResult<Reservation> => {
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = reservationsList.slice(startIndex, endIndex)

      return {
        data: paginatedData,
        pagination: {
          page,
          pageSize,
          total: Math.ceil(reservationsList.length / pageSize),
        },
      }
    },
    [],
  )

  return {
    reservations,
    isLoading,
    addReservation,
    cancelReservation,
    getUserReservations,
    getEventReservations,
    paginateReservations,
  }
}
