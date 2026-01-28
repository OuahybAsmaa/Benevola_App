// API functions for authentication

export async function loginUser(email: string, password: string, role: "benevole" | "organisation") {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        email,
        firstName: "Jean",
        lastName: "Dupont",
        role,
        avatar: "/diverse-user-avatars.png",
      })
    }, 1000)
  })
}

export async function registerUser(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: "benevole" | "organisation"
}) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        avatar: "/diverse-user-avatars.png",
      })
    }, 1000)
  })
}
