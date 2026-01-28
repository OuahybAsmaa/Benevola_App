// App.js - Login après Splash
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { store } from "./src/redux/store"
import { useAppDispatch, useAppSelector } from "./src/redux/hooks"
import { checkAuthThunk } from "./src/redux/thunks/authThunks"

// Imports des écrans
import SplashScreen from "./src/screen/SplashScreen"
import WelcomeScreen from "./src/screen/WelcomeScreen"
import LoginScreen from "./src/screen/LoginScreen"
import RegisterScreen from "./src/screen/RegisterScreen"
import HomeScreen from "./src/screen/HomeScreen"
import MapScreen from "./src/screen/MapScreen"
import MissionDetailScreen from "./src/screen/MissionDetailScreen"
import NotificationsScreen from "./src/screen/NotificationsScreen"
import ProfileScreen from "./src/screen/ProfileScreen"
import OrganizerDashboardScreen from "./src/screen/organizer/OrganizerDashboardScreen"
import OrganizerMissionsScreen from "./src/screen/organizer/OrganizerMissionsScreen"
import OrganizerCreateMissionScreen from "./src/screen/organizer/OrganizerCreateMissionScreen"
import ProfilOrganisateur from "./src/screen/organizer/ProfilOrganisateur"
import EditOrganizerProfileScreen from "./src/screen/organizer/EditOrganizerProfileScreen"
import EditMissionScreen from "./src/screen/organizer/EditMissionScreen"
import EditProfileScreen from "./src/screen/EditProfileScreen"

// Composant interne qui utilise Redux
function AppContent() {
  const dispatch = useAppDispatch()
  const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [selectedMissionId, setSelectedMissionId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      // Vérifier si un utilisateur est déjà connecté
      await dispatch(checkAuthThunk())
    }

    initializeApp()
  }, [dispatch])

  // Gérer le splash screen et la navigation initiale
  useEffect(() => {
    if (isInitialized) {
      // Attendre 2.5 secondes pour le splash screen
      const timer = setTimeout(() => {
        setIsLoading(false)
        
        // 🎯 MODIFICATION : Toujours aller au login après le splash
        if (isAuthenticated && user) {
          // Si déjà connecté, rediriger selon le rôle
          if (user.role === "organisation") {
            setCurrentScreen("organizer-dashboard")
          } else {
            setCurrentScreen("home")
          }
        } else {
          // 🔥 CHANGEMENT ICI : Aller directement au login au lieu du welcome
          setCurrentScreen("login")
        }
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isInitialized, isAuthenticated, user])

  // Afficher le splash screen pendant le chargement
  if (isLoading || !isInitialized) {
    return <SplashScreen />
  }

  // Fonction de navigation
  const navigate = (screen, id) => {
    if (id) {
      setSelectedMissionId(id)
    }
    setCurrentScreen(screen)
  }

  // Rendu de l'écran actuel
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />
      case "welcome":
        return <WelcomeScreen onGetStarted={navigate} />
      case "login":
        return <LoginScreen onNavigate={navigate} />
      case "register":
        return <RegisterScreen onNavigate={navigate} />
      case "home":
        return <HomeScreen onNavigate={navigate} />
      case "map":
        return <MapScreen onNavigate={navigate} />
      case "mission-detail":
        return <MissionDetailScreen missionId={selectedMissionId} onNavigate={navigate} />
      case "notifications":
        return <NotificationsScreen onNavigate={navigate} />
      case "profile":
        return <ProfileScreen onNavigate={navigate} />
      case "organizer-dashboard":
        return <OrganizerDashboardScreen onNavigate={navigate} />
      case "organizer-missions":
        return <OrganizerMissionsScreen onNavigate={navigate} />
      case "organizer-create":
        return <OrganizerCreateMissionScreen onNavigate={navigate} />
      case "profil-organisateur":
        return <ProfilOrganisateur onNavigate={navigate} />
      case "edit-organizer-profile":
        return <EditOrganizerProfileScreen onNavigate={navigate} />
      case "edit-mission":
        return <EditMissionScreen onNavigate={navigate} missionId={selectedMissionId} />
      case "edit-profile":
        return <EditProfileScreen onNavigate={navigate} />
      default:
        return <LoginScreen onNavigate={navigate} />
        
    }
  }

  return renderScreen()
}

// Composant racine avec le Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}