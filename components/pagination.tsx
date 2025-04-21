"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Ne pas afficher la pagination s'il n'y a qu'une seule page
  if (totalPages <= 1) {
    return null
  }

  // Fonction pour générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = []

    // Toujours afficher la première page
    pageNumbers.push(1)

    // Calculer la plage de pages à afficher autour de la page actuelle
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Ajouter des ellipses si nécessaire avant la plage
    if (startPage > 2) {
      pageNumbers.push("ellipsis-start")
    } else if (startPage === 2) {
      pageNumbers.push(2)
    }

    // Ajouter les pages dans la plage
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i)
      }
    }

    // Ajouter des ellipses si nécessaire après la plage
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end")
    } else if (endPage === totalPages - 1) {
      pageNumbers.push(totalPages - 1)
    }

    // Toujours afficher la dernière page si elle existe
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // Obtenir un tableau unique de numéros de page sans doublons
  const pageNumbers = Array.from(new Set(getPageNumbers()))

  return (
    <nav className="flex items-center justify-center space-x-2 py-4" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Page précédente</span>
      </Button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <Button key={`ellipsis-${index}`} variant="outline" size="icon" disabled className="cursor-default">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Plus de pages</span>
              </Button>
            )
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Page suivante</span>
      </Button>
    </nav>
  )
}
