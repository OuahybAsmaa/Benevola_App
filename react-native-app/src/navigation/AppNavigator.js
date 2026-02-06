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
import { PermissionRequestModal } from "../components/PermissionRequestModal"
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
  
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  
  const hasNavigatedAfterAuth = useRef(false)
  const permissionCheckTimer = useRef(null)
  const tokenRegistered = useRef(false) 

  const { 
    expoPushToken, 
    permissionGranted, 
    requestPermissions,
    registerFcmToken 
  } = usePushNotifications({
    onNotificationReceived: (notification) => {
    },
    onNotificationTapped: (response) => {
      handleNotificationNavigation(response.notification.request.content.data)
    },
  })

  // ===== FONCTION POUR GÉRER LA NAVIGATION DES NOTIFICATIONS =====
  const handleNotificationNavigation = useCallback((data) => {
    
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

  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(checkAuthThunk())
    }
    initializeApp()
  }, [dispatch])

  useEffect(() => {
    const registerToken = async () => {

      if (isAuthenticated && expoPushToken && permissionGranted && !tokenRegistered.current) {
        try {
          await registerFcmToken(expoPushToken)
          tokenRegistered.current = true
        } catch (error) {
        }
      }
      
      if (!isAuthenticated && tokenRegistered.current) {
        tokenRegistered.current = false
      }
    }

    registerToken()
  }, [isAuthenticated, expoPushToken, permissionGranted, registerFcmToken])

  useEffect(() => {
    if (!isLoading && isAuthenticated && !permissionRequested) {
  
      permissionCheckTimer.current = setTimeout(() => {
        if (!permissionGranted) {
          setShowPermissionModal(true)
        }
        setPermissionRequested(true)
      }, 2000) 
    }

    return () => {
      if (permissionCheckTimer.current) {
        clearTimeout(permissionCheckTimer.current)
      }
    }
  }, [isLoading, isAuthenticated, permissionGranted, permissionRequested])


  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermissions()
      
    
      if (granted && expoPushToken && isAuthenticated && !tokenRegistered.current) {
        await registerFcmToken(expoPushToken)
        tokenRegistered.current = true
      }
      
      return granted
    } catch (error) {
      return false
    }
  }


  const navigate = useCallback((screen, params = null, resetHistory = false) => {
    

    if (params !== null && params !== undefined) {
      if (typeof params === 'object') {
        if (screen === 'organizer-messaging') {
          setSelectedMissionId(params.missionId)
          if (params.missionTitle) {
            setSelectedMissionTitle(params.missionTitle)
          }
        }
        else if (screen === 'messaging') {
          setMessagingParams(params)
        }
        else if (params.missionId) {
          setSelectedMissionId(params.missionId)
        }
      } else if (typeof params === 'string') {
        setSelectedMissionId(params)
      }
    }
    
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

    setCurrentScreen(screen)
  }, [currentScreen])

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


  if (isLoading || !isInitialized) {
    return (
      <>
        <SplashScreen />
        <PermissionRequestModal
          visible={false}
          onClose={() => {}}
          onGrantPermission={handleRequestPermission}
        />
      </>
    )
  }

  const navigationObject = {
    navigate,
    goBack,
    currentScreen,
    canGoBack: navigationHistory.length > 0,
    resetAndNavigate: (screen, params = null) => navigate(screen, params, true)
  }

  const renderScreen = () => {
    const ScreenComponent = SCREENS[currentScreen]
    
    if (!ScreenComponent) {
      return <LoginScreen onNavigate={navigate} navigation={navigationObject} />
    }

    const commonProps = {
      onNavigate: navigate,
      navigation: navigationObject,
    }

    const specificProps = {}
    
    if (currentScreen === "mission-detail" || currentScreen === "edit-mission") {
      specificProps.missionId = selectedMissionId
    }

    if (currentScreen === "organizer-messaging") {
      
      specificProps.missionId = selectedMissionId
      if (selectedMissionTitle) {
        specificProps.missionTitle = selectedMissionTitle
      }
    }

    if (currentScreen === "messaging" && messagingParams) {
      specificProps.organizerId = messagingParams.organizerId
      specificProps.organizerName = messagingParams.organizerName
      specificProps.missionId = messagingParams.missionId
      specificProps.missionTitle = messagingParams.missionTitle
    }

    return <ScreenComponent {...commonProps} {...specificProps} />
  }

  return (
    <>
      {renderScreen()}

      <PermissionRequestModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onGrantPermission={handleRequestPermission}
      />
    </>
  )
}

export default AppNavigator