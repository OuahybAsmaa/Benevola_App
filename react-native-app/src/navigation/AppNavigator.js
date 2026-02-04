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
import MessagingScreen from "../screen/MessagingScreen"
import NotificationsScreen from "../screen/NotificationsScreen"
import ProfileScreen from "../screen/ProfileScreen"
import OrganizerDashboardScreen from "../screen/organizer/OrganizerDashboardScreen"

import OrganizerCreateMissionScreen from "../screen/organizer/OrganizerCreateMissionScreen"
import ProfilOrganisateur from "../screen/organizer/ProfilOrganisateur"
import EditOrganizerProfileScreen from "../screen/organizer/EditOrganizerProfileScreen"
import EditMissionScreen from "../screen/organizer/EditMissionScreen"
import EditProfileScreen from "../screen/EditProfileScreen"
import OrganizerMessagingScreen from "../screen/organizer/OrganizerMessagingScreen"

// ⭐ AJOUT : Importer le modal de permissions
import { PermissionRequestModal } from "../components/PermissionRequestModal"
// ⭐ AJOUT : Importer le hook de notifications
import { usePushNotifications } from "../hooks/usePushNotifications"

// ===== CONFIGURATION DES ÉCRANS =====
const SCREENS = {
  splash: SplashScreen,
  welcome: WelcomeScreen,
  login: LoginScreen,
  register: RegisterScreen,
  home: HomeScreen,
  map: MapScreen,
  "mission-detail": MissionDetailScreen,
  messaging: MessagingScreen,
  notifications: NotificationsScreen,
  profile: ProfileScreen,
  "organizer-dashboard": OrganizerDashboardScreen,
  "organizer-create": OrganizerCreateMissionScreen,
  "profil-organisateur": ProfilOrganisateur,
  "edit-organizer-profile": EditOrganizerProfileScreen,
  "edit-mission": EditMissionScreen,
  "edit-profile": EditProfileScreen,
  "organizer-messaging": OrganizerMessagingScreen,
}

// ===== COMPOSANT PRINCIPAL DE NAVIGATION =====
function AppNavigator() {
  const dispatch = useAppDispatch()
  const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [navigationHistory, setNavigationHistory] = useState([])
  const [selectedMissionId, setSelectedMissionId] = useState(null)
  const [selectedMissionTitle, setSelectedMissionTitle] = useState(null)
  const [messagingParams, setMessagingParams] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // ⭐ AJOUT : États pour le modal de permissions
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  
  // Utiliser une ref pour éviter les re-renders
  const hasNavigatedAfterAuth = useRef(false)
  const permissionCheckTimer = useRef(null)
  const tokenRegistered = useRef(false) // ⭐ NOUVEAU : Tracker si le token est déjà enregistré

  // ⭐ AJOUT : Initialiser les notifications push
  const { 
    expoPushToken, 
    permissionGranted, 
    requestPermissions,
    registerFcmToken // ⭐ NOUVEAU : Fonction pour enregistrer le token
  } = usePushNotifications({
    onNotificationReceived: (notification) => {
      console.log('📬 Notification reçue:', notification)
      // Vous pouvez gérer les notifications ici si nécessaire
    },
    onNotificationTapped: (response) => {
      console.log('👆 Notification tapée:', response)
      // Gérer la navigation lorsqu'on clique sur une notification
      handleNotificationNavigation(response.notification.request.content.data)
    },
  })

  // ===== FONCTION POUR GÉRER LA NAVIGATION DES NOTIFICATIONS =====
  const handleNotificationNavigation = useCallback((data) => {
    console.log('🧭 Navigation depuis notification:', data)
    
    if (data?.missionId) {
      if (user?.role === "organisation") {
        navigate("organizer-messaging", {
          missionId: data.missionId,
          missionTitle: data.missionTitle || "Mission"
        })
      } else {
        navigate("messaging", {
          organizerId: data.organizerId || data.senderId,
          organizerName: data.organizerName || data.senderName || "Organisateur",
          missionId: data.missionId,
          missionTitle: data.missionTitle || "Mission"
        })
      }
    }
  }, [user])

  // ===== INITIALISATION DE L'APP =====
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(checkAuthThunk())
    }
    initializeApp()
  }, [dispatch])

  // ⭐ NOUVEAU : ENREGISTRER LE TOKEN FCM APRÈS CONNEXION
  useEffect(() => {
    const registerToken = async () => {
      // Vérifier que :
      // 1. L'utilisateur est connecté
      // 2. On a un token
      // 3. Les permissions sont accordées
      // 4. Le token n'a pas déjà été enregistré
      if (isAuthenticated && expoPushToken && permissionGranted && !tokenRegistered.current) {
        console.log('👤 Utilisateur connecté, enregistrement du token FCM...')
        try {
          await registerFcmToken(expoPushToken)
          tokenRegistered.current = true
          console.log('✅ Token FCM enregistré avec succès')
        } catch (error) {
          console.error('❌ Erreur enregistrement token FCM:', error)
        }
      }
      
      // Réinitialiser le flag si l'utilisateur se déconnecte
      if (!isAuthenticated && tokenRegistered.current) {
        tokenRegistered.current = false
      }
    }

    registerToken()
  }, [isAuthenticated, expoPushToken, permissionGranted, registerFcmToken])

  // ===== VÉRIFICATION DES PERMISSIONS APRÈS CONNEXION =====
  useEffect(() => {
    if (!isLoading && isAuthenticated && !permissionRequested) {
      // Vérifier les permissions après un délai
      permissionCheckTimer.current = setTimeout(() => {
        if (!permissionGranted) {
          setShowPermissionModal(true)
        }
        setPermissionRequested(true)
      }, 2000) // 2 secondes après la connexion
    }

    return () => {
      if (permissionCheckTimer.current) {
        clearTimeout(permissionCheckTimer.current)
      }
    }
  }, [isLoading, isAuthenticated, permissionGranted, permissionRequested])

  // ===== FONCTION POUR DEMANDER LES PERMISSIONS =====
  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermissions()
      
      // ⭐ NOUVEAU : Si les permissions sont accordées, enregistrer le token immédiatement
      if (granted && expoPushToken && isAuthenticated && !tokenRegistered.current) {
        console.log('✅ Permissions accordées, enregistrement du token...')
        await registerFcmToken(expoPushToken)
        tokenRegistered.current = true
      }
      
      return granted
    } catch (error) {
      console.error('Erreur demande permissions:', error)
      return false
    }
  }

  // ===== FONCTION DE NAVIGATION PRINCIPALE (useCallback pour stabilité) =====
  const navigate = useCallback((screen, params = null, resetHistory = false) => {
    console.log('🧭 Navigation vers:', screen, 'avec params:', params)
    
    // Gérer les params
    if (params !== null && params !== undefined) {
      if (typeof params === 'object') {
        if (screen === 'organizer-messaging') {
          console.log('💬 Params messagerie organisateur:', params)
          setSelectedMissionId(params.missionId)
          if (params.missionTitle) {
            setSelectedMissionTitle(params.missionTitle)
          }
        }
        else if (screen === 'messaging') {
          console.log('💬 Params messagerie bénévole:', params)
          setMessagingParams(params)
        }
        else if (params.missionId) {
          console.log('🆔 Mission ID reçu (objet):', params.missionId)
          setSelectedMissionId(params.missionId)
        }
      } else if (typeof params === 'string') {
        console.log('🆔 Mission ID reçu (string):', params)
        setSelectedMissionId(params)
      }
    }
    
    // Gérer l'historique de navigation
    if (resetHistory) {
      setNavigationHistory([])
    } else {
      setNavigationHistory(prev => {
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
        const targetScreen = user.role === "organisation" ? "organizer-dashboard" : "home"
        setCurrentScreen(targetScreen)
        setNavigationHistory([])
      } else {
        setCurrentScreen("login")
        setNavigationHistory([])
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isInitialized])

  // ===== LISTENER POUR NAVIGATION AUTOMATIQUE APRÈS LOGIN =====
  useEffect(() => {
    if (isLoading || !isInitialized) {
      hasNavigatedAfterAuth.current = false
      return
    }
    
    if (isAuthenticated && user && !hasNavigatedAfterAuth.current) {
      const isOnAuthScreen = ["login", "register", "welcome", "splash"].includes(currentScreen)
      
      if (isOnAuthScreen) {
        const targetScreen = user.role === "organisation" ? "organizer-dashboard" : "home"
        setCurrentScreen(targetScreen)
        setNavigationHistory([])
        hasNavigatedAfterAuth.current = true
      }
    }
    
    if (!isAuthenticated) {
      hasNavigatedAfterAuth.current = false
      
      const isOnProtectedScreen = !["login", "register", "welcome", "splash"].includes(currentScreen)
      if (isOnProtectedScreen) {
        setCurrentScreen("login")
        setNavigationHistory([])
      }
    }
  }, [isAuthenticated, user, isInitialized, isLoading, currentScreen])

  // ===== AFFICHAGE DU SPLASH SCREEN =====
  if (isLoading || !isInitialized) {
    return (
      <>
        <SplashScreen />
        {/* ⭐ AJOUT : Modal de permissions (caché pendant le splash) */}
        <PermissionRequestModal
          visible={false}
          onClose={() => {}}
          onGrantPermission={handleRequestPermission}
        />
      </>
    )
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
    
    if (!ScreenComponent) {
      console.warn(`Écran "${currentScreen}" non trouvé, redirection vers login`)
      return <LoginScreen onNavigate={navigate} navigation={navigationObject} />
    }

    const commonProps = {
      onNavigate: navigate,
      navigation: navigationObject,
    }

    const specificProps = {}
    
    if (currentScreen === "mission-detail" || currentScreen === "edit-mission") {
      console.log('📦 Passage du missionId au composant:', selectedMissionId)
      specificProps.missionId = selectedMissionId
    }

    if (currentScreen === "organizer-messaging") {
      console.log('💬 Passage des params au OrganizerMessagingScreen:')
      console.log('- Mission ID:', selectedMissionId)
      console.log('- Mission Title:', selectedMissionTitle)
      
      specificProps.missionId = selectedMissionId
      if (selectedMissionTitle) {
        specificProps.missionTitle = selectedMissionTitle
      }
    }

    if (currentScreen === "messaging" && messagingParams) {
      console.log('💬 Passage des params messagerie bénévole au composant:', messagingParams)
      specificProps.organizerId = messagingParams.organizerId
      specificProps.organizerName = messagingParams.organizerName
      specificProps.missionId = messagingParams.missionId
      specificProps.missionTitle = messagingParams.missionTitle
    }

    return <ScreenComponent {...commonProps} {...specificProps} />
  }

  return (
    <>
      {/* Écran principal */}
      {renderScreen()}
      
      {/* ⭐ AJOUT : Modal de permissions */}
      <PermissionRequestModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onGrantPermission={handleRequestPermission}
      />
    </>
  )
}

export default AppNavigator