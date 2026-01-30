// services/api/mission.service.ts

export interface Mission {
  id: string
  title: string
  category: string
  image: any
  distance: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  organization: {
    name: string
    logo: any
    verified?: boolean
  }
  description?: string
  requirements?: string[]
  address?: string
  latitude?: number
  longitude?: number
}

class MissionService {
  private mockMissions: Mission[] = [
    {
      id: "1",
      title: "Nettoyage de la plage Ain Diab",
      category: "Environnement",
      image: require("../../assets/beach-cleanup-volunteers.png"),
      distance: "2.5 km",
      date: "23 Décembre 2024",
      time: "09:00 - 12:00",
      participants: 5,
      maxParticipants: 10,
      organization: {
        name: "Association Verte",
        logo: require("../../assets/environmental-organization-logo.png"),
        verified: true,
      },
      description: "Rejoignez-nous pour une action de nettoyage de la plage d'Ain Diab.",
      requirements: ["Gants fournis", "Tenue décontractée", "Eau recommandée"],
      address: "Plage Ain Diab, Boulevard de l'Océan Atlantique, Casablanca",
      latitude: 33.5731,
      longitude: -7.5898,
    },
    {
      id: "2",
      title: "Aide aux devoirs pour enfants",
      category: "Éducation",
      image: require("../../assets/tutoring-children-education.jpg"),
      distance: "1.2 km",
      date: "24 Décembre 2024",
      time: "14:00 - 17:00",
      participants: 8,
      maxParticipants: 15,
      organization: {
        name: "Éducation Pour Tous",
        logo: require("../../assets/education-organization-logo.jpg"),
        verified: true,
      },
      latitude: 33.585,
      longitude: -7.6,
    },
    {
      id: "3",
      title: "Visite aux personnes âgées",
      category: "Social",
      image: require("../../assets/visiting-elderly-people.jpg"),
      distance: "3.8 km",
      date: "25 Décembre 2024",
      time: "10:00 - 13:00",
      participants: 12,
      maxParticipants: 12,
      organization: {
        name: "Cœurs Solidaires",
        logo: require("../../assets/social-organization-logo.png"),
        verified: false,
      },
      latitude: 33.565,
      longitude: -7.58,
    },
  ]

  async getMissions(filters?: {
    category?: string
    city?: string
  }): Promise<Mission[]> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filteredMissions = [...this.mockMissions]

      if (filters?.category && filters.category !== "all") {
        filteredMissions = filteredMissions.filter(
          (m) => m.category.toLowerCase() === filters.category?.toLowerCase()
        )
      }

      return filteredMissions
    } catch (error) {
      throw new Error("Erreur lors du chargement des missions")
    }
  }

  async getMissionById(id: string): Promise<Mission | null> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const mission = this.mockMissions.find((m) => m.id === id)
      return mission || null
    } catch (error) {
      throw new Error("Erreur lors du chargement de la mission")
    }
  }

  async registerToMission(missionId: string, userId: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mission = this.mockMissions.find((m) => m.id === missionId)
      if (mission && mission.participants < mission.maxParticipants) {
        mission.participants += 1
        return true
      }
      return false
    } catch (error) {
      throw new Error("Erreur lors de l'inscription")
    }
  }

  async unregisterFromMission(missionId: string, userId: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mission = this.mockMissions.find((m) => m.id === missionId)
      if (mission && mission.participants > 0) {
        mission.participants -= 1
        return true
      }
      return false
    } catch (error) {
      throw new Error("Erreur lors de la désinscription")
    }
  }
}

export default new MissionService()