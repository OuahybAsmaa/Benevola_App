// src/navigation/AppNavigator.js
import { useEffect, useState, useCallback, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { checkAuthThunk } from "../redux/thunks/authThunks"

// Imports des écrans
import SplashScreen from "../screen/SplashScreen"
import WelcomeScreen from "../screen/WelcomeScreen"
import LoginScreen from "../screen/LoginScreen"
import RegisterScreen from "../screen/RegisterScreen"
import HomeScreen from "../screen/HomeScreen"
import MapScreen from "../screen/MapScreen"
import MissionDetailScreen from "../screen/MissionDetailScreen"
import NotificationsScreen from "../screen/NotificationsScreen"
import ProfileScreen from "../screen/ProfileScreen"
import OrganizerDashboardScreen from "../screen/organizer/OrganizerDashboardScreen"
import OrganizerMissionsScreen from "../screen/organizer/OrganizerMissionsScreen"
import OrganizerCreateMissionScreen from "../screen/organizer/OrganizerCreateMissionScreen"
import ProfilOrganisateur from "../screen/organizer/ProfilOrganisateur"
import EditOrganizerProfileScreen from "../screen/organizer/EditOrganizerProfileScreen"
import EditMissionScreen from "../screen/organizer/EditMissionScreen"
import EditProfileScreen from "../screen/EditProfileScreen"

// ===== CONFIGURATION DES ÉCRANS =====
const SCREENS = {
  splash: SplashScreen,
  welcome: WelcomeScreen,
  login: LoginScreen,
  register: RegisterScreen,
  home: HomeScreen,
  map: MapScreen,
  "mission-detail": MissionDetailScreen,
  notifications: NotificationsScreen,
  profile: ProfileScreen,
  "organizer-dashboard": OrganizerDashboardScreen,
  "organizer-missions": OrganizerMissionsScreen,
  "organizer-create": OrganizerCreateMissionScreen,
  "profil-organisateur": ProfilOrganisateur,
  "edit-organizer-profile": EditOrganizerProfileScreen,
  "edit-mission": EditMissionScreen,
  "edit-profile": EditProfileScreen,
}

// ===== COMPOSANT PRINCIPAL DE NAVIGATION =====
function AppNavigator() {
  const dispatch = useAppDispatch()
  const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [navigationHistory, setNavigationHistory] = useState([])
  const [selectedMissionId, setSelectedMissionId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Utiliser une ref pour éviter les re-renders
  const hasNavigatedAfterAuth = useRef(false)

  // ===== INITIALISATION DE L'APP =====
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(checkAuthThunk())
    }
    initializeApp()
  }, [dispatch])

  // ===== FONCTION DE NAVIGATION PRINCIPALE (useCallback pour stabilité) =====
  const navigate = useCallback((screen, params = null, resetHistory = false) => {
    console.log('🧭 Navigation vers:', screen, 'avec params:', params) // ⭐ DEBUG
    
    // Gérer les params (peut être un objet ou directement un ID pour rétrocompatibilité)
    if (params !== null && params !== undefined) {
      if (typeof params === 'object' && params.missionId) {
        // Nouveau format : navigate("edit-mission", { missionId: "xxx" })
        console.log('🆔 Mission ID reçu (objet):', params.missionId) // ⭐ DEBUG
        setSelectedMissionId(params.missionId)
      } else if (typeof params === 'string') {
        // Ancien format : navigate("mission-detail", "id-xxx")
        console.log('🆔 Mission ID reçu (string):', params) // ⭐ DEBUG
        setSelectedMissionId(params)
      }
    }
    
    // Gérer l'historique de navigation
    if (resetHistory) {
      setNavigationHistory([])
    } else {
      setNavigationHistory(prev => {
        // Éviter d'ajouter le même écran deux fois de suite
        if (prev.length > 0 && prev[prev.length - 1] === currentScreen) {
          return prev
        }
        return [...prev, currentScreen]
      })
    }
    
    // Changer d'écran
    setCurrentScreen(screen)
  }, [currentScreen])

  // ===== FONCTION POUR REVENIR EN ARRIÈRE =====
  const goBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1]
      setNavigationHistory(prev => prev.slice(0, -1))
      setCurrentScreen(previousScreen)
    } else {
      // Pas d'historique : retour à l'écran par défaut selon le rôle
      if (user?.role === "organisation") {
        setCurrentScreen("organizer-dashboard")
        setNavigationHistory([])
      } else if (isAuthenticated) {
        setCurrentScreen("home")
        setNavigationHistory([])
      } else {
        setCurrentScreen("login")
        setNavigationHistory([])
      }
    }
  }, [navigationHistory, user, isAuthenticated])

  // ===== GESTION DU SPLASH SCREEN ET NAVIGATION INITIALE =====
  useEffect(() => {
    if (!isInitialized) return

    const timer = setTimeout(() => {
      setIsLoading(false)
      
      if (isAuthenticated && user) {
        // Si déjà connecté, rediriger selon le rôle
        const targetScreen = user.role === "organisation" ? "organizer-dashboard" : "home"
        setCurrentScreen(targetScreen)
        setNavigationHistory([])
      } else {
        // Aller directement au login
        setCurrentScreen("login")
        setNavigationHistory([])
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isInitialized]) // Seulement isInitialized !

  // ===== LISTENER POUR NAVIGATION AUTOMATIQUE APRÈS LOGIN =====
  useEffect(() => {
    // Ne pas naviguer si on est encore en chargement
    if (isLoading || !isInitialized) {
      hasNavigatedAfterAuth.current = false
      return
    }
    
    // Navigation automatique après login
    if (isAuthenticated && user && !hasNavigatedAfterAuth.current) {
      const isOnAuthScreen = ["login", "register", "welcome", "splash"].includes(currentScreen)
      
      if (isOnAuthScreen) {
        const targetScreen = user.role === "organisation" ? "organizer-dashboard" : "home"
        setCurrentScreen(targetScreen)
        setNavigationHistory([])
        hasNavigatedAfterAuth.current = true
      }
    }
    
    // Réinitialiser le flag si l'utilisateur se déconnecte
    if (!isAuthenticated) {
      hasNavigatedAfterAuth.current = false
      
      // Rediriger vers login si on est sur un écran protégé
      const isOnProtectedScreen = !["login", "register", "welcome", "splash"].includes(currentScreen)
      if (isOnProtectedScreen) {
        setCurrentScreen("login")
        setNavigationHistory([])
      }
    }
  }, [isAuthenticated, user, isInitialized, isLoading, currentScreen])

  // ===== AFFICHAGE DU SPLASH SCREEN =====
  if (isLoading || !isInitialized) {
    return <SplashScreen />
  }

  // ===== OBJET NAVIGATION À PASSER AUX COMPOSANTS =====
  const navigationObject = {
    navigate,
    goBack,
    currentScreen,
    canGoBack: navigationHistory.length > 0,
    resetAndNavigate: (screen, params = null) => navigate(screen, params, true)
  }

  // ===== RENDU DE L'ÉCRAN ACTUEL =====
  const renderScreen = () => {
    const ScreenComponent = SCREENS[currentScreen]
    
    // Écran non trouvé : redirection vers login
    if (!ScreenComponent) {
      console.warn(`Écran "${currentScreen}" non trouvé, redirection vers login`)
      return <LoginScreen onNavigate={navigate} navigation={navigationObject} />
    }

    // Props communes à tous les écrans
    const commonProps = {
      onNavigate: navigate,
      navigation: navigationObject,
    }

    // Props spécifiques pour certains écrans
    const specificProps = {}
    
    // Ajouter missionId si nécessaire
    if (currentScreen === "mission-detail" || currentScreen === "edit-mission") {
      console.log('📦 Passage du missionId au composant:', selectedMissionId) // ⭐ DEBUG
      specificProps.missionId = selectedMissionId
    }

    // Rendu du composant avec toutes les props
    return <ScreenComponent {...commonProps} {...specificProps} />
  }

  return renderScreen()
}

export default AppNavigator