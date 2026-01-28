// hooks/useMissions.ts
import { useState, useEffect, useCallback } from "react"
import missionService, { Mission } from "../services/api/mission.service"

interface UseMissionsOptions {
  category?: string
  city?: string
  autoLoad?: boolean // Option pour charger automatiquement ou non
}

interface UseMissionsReturn {
  missions: Mission[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  loadMissions: () => Promise<void>
}

export function useMissions(options?: UseMissionsOptions): UseMissionsReturn {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { category, city, autoLoad = true } = options || {}

  // Fonction pour charger les missions
  const loadMissions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const filters = {
        category: category !== "all" ? category : undefined,
        city: city || undefined,
      }
      
      const data = await missionService.getMissions(filters)
      setMissions(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      console.error("Error loading missions:", err)
    } finally {
      setIsLoading(false)
    }
  }, [category, city])

  // Charger automatiquement au montage et quand les filtres changent
  useEffect(() => {
    if (autoLoad) {
      loadMissions()
    }
  }, [loadMissions, autoLoad])

  // Fonction de rafraîchissement
  const refresh = useCallback(async () => {
    await loadMissions()
  }, [loadMissions])

  return {
    missions,
    isLoading,
    error,
    refresh,
    loadMissions,
  }
}