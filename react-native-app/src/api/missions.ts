// API functions for missions

export interface Mission {
  id: string
  title: string
  category: string
  image: string
  distance: string
  date: string
  time: string
  participants: number
  maxParticipants: number
  organization: {
    name: string
    logo: string
  }
}

export async function getMissions(): Promise<Mission[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Nettoyage de la plage Ain Diab",
          category: "Environnement",
          image: "/beach-cleanup-volunteers.png",
          distance: "2.5 km",
          date: "23 Décembre 2024",
          time: "09:00 - 12:00",
          participants: 5,
          maxParticipants: 10,
          organization: {
            name: "Association Verte",
            logo: "/environmental-organization-logo.png",
          },
        },
      ])
    }, 500)
  })
}

export async function getMissionById(id: string): Promise<Mission | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: "Nettoyage de la plage Ain Diab",
        category: "Environnement",
        image: "/beach-cleanup-volunteers.png",
        distance: "2.5 km",
        date: "23 Décembre 2024",
        time: "09:00 - 12:00",
        participants: 5,
        maxParticipants: 10,
        organization: {
          name: "Association Verte",
          logo: "/environmental-organization-logo.png",
        },
      })
    }, 500)
  })
}
