// hooks/useMissionDetail.ts
import { useState, useEffect, useCallback } from "react"
import missionService, { Mission } from "../services/mission.service"
import { useAuth } from "./useAuth"

interface UseMissionDetailReturn {
  mission: Mission | null
  isLoading: boolean
  error: string | null
  isRegistered: boolean
  isFavorite: boolean
  toggleRegistration: () => Promise<void>
  toggleFavorite: () => void
  refresh: () => Promise<void>
}

export function useMissionDetail(missionId: string | null): UseMissionDetailReturn {
  const { user } = useAuth()
  
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Fonction pour charger la mission
  const loadMission = useCallback(async () => {
    if (!missionId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await missionService.getMissionById(missionId)
      setMission(data)
      
      // TODO: Charger le statut d'inscription depuis l'API
      // const registrationStatus = await missionService.checkRegistration(missionId, user?.id)
      // setIsRegistered(registrationStatus)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur de chargement"
      setError(errorMessage)
      console.error("Error loading mission:", err)
    } finally {
      setIsLoading(false)
    }
  }, [missionId, user?.id])

  // Charger la mission au montage et quand l'ID change
  useEffect(() => {
    loadMission()
  }, [loadMission])

  // Toggle inscription/désinscription
  const toggleRegistration = useCallback(async () => {
    if (!missionId || !user) {
      console.error("Mission ID or user not available")
      return
    }

    try {
      if (isRegistered) {
        // Désinscription
        await missionService.unregisterFromMission(missionId, user.id)
        setIsRegistered(false)
        
        // Mettre à jour le nombre de participants localement
        if (mission) {
          setMission({
            ...mission,
            participants: Math.max(0, mission.participants - 1)
          })
        }
      } else {
        // Inscription
        const success = await missionService.registerToMission(missionId, user.id)
        
        if (success) {
          setIsRegistered(true)
          
          // Mettre à jour le nombre de participants localement
          if (mission) {
            setMission({
              ...mission,
              participants: mission.participants + 1
            })
          }
        } else {
          throw new Error("La mission est complète")
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription"
      setError(errorMessage)
      throw err
    }
  }, [missionId, user, isRegistered, mission])

  // Toggle favori
  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev)
    // TODO: Appeler l'API pour sauvegarder le favori
    // await missionService.toggleFavorite(missionId, user?.id)
  }, [])

  // Fonction de rafraîchissement
  const refresh = useCallback(async () => {
    await loadMission()
  }, [loadMission])

  return {
    mission,
    isLoading,
    error,
    isRegistered,
    isFavorite,
    toggleRegistration,
    toggleFavorite,
    refresh,
  }
}