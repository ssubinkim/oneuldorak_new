import { useEffect, useState } from 'react'

const USER_PROFILE_STORAGE_KEY = 'oneuldorak:user-profile'
const USER_PROFILE_CHANGED_EVENT = 'oneuldorak:user-profile-changed'

type UserProfile = {
  email: string
  name: string
  nickname: string
}

const defaultUserProfile: UserProfile = {
  email: 'dorak_friends@oneuldorak.com',
  name: '도락이',
  nickname: '도락프렌즈',
}

let currentUserProfile = readStoredUserProfile()

function readStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return defaultUserProfile
  }

  const storedProfile = window.sessionStorage.getItem(USER_PROFILE_STORAGE_KEY)

  if (!storedProfile) {
    return defaultUserProfile
  }

  try {
    const parsedProfile = JSON.parse(storedProfile) as Partial<UserProfile>

    return {
      email: parsedProfile.email || defaultUserProfile.email,
      name: parsedProfile.name || defaultUserProfile.name,
      nickname: parsedProfile.nickname || defaultUserProfile.nickname,
    }
  } catch {
    return defaultUserProfile
  }
}

export function saveUserProfile(profile: Partial<UserProfile>) {
  currentUserProfile = {
    ...currentUserProfile,
    ...profile,
    nickname: profile.nickname?.trim() || currentUserProfile.nickname,
  }

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(currentUserProfile))
    window.dispatchEvent(new Event(USER_PROFILE_CHANGED_EVENT))
  }
}

export function getUserProfile() {
  return currentUserProfile
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(getUserProfile)

  useEffect(() => {
    const syncUserProfile = () => {
      currentUserProfile = readStoredUserProfile()
      setUserProfile(currentUserProfile)
    }

    window.addEventListener(USER_PROFILE_CHANGED_EVENT, syncUserProfile)
    window.addEventListener('storage', syncUserProfile)
    syncUserProfile()

    return () => {
      window.removeEventListener(USER_PROFILE_CHANGED_EVENT, syncUserProfile)
      window.removeEventListener('storage', syncUserProfile)
    }
  }, [])

  return userProfile
}
