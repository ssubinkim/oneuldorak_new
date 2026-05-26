import { useEffect, useState } from 'react'
import carrotPro from '../../assets/food_mascot/carrot_pro.png'
import broPro from '../../assets/food_mascot/bro_pro.png'
import strawPro from '../../assets/food_mascot/straw_pro.png'
import eggPro from '../../assets/food_mascot/egg_pro.png'
import bluePro from '../../assets/food_mascot/blue_pro.png'

const USER_PROFILE_STORAGE_KEY = 'oneuldorak:user-profile'
const USER_PROFILE_CHANGED_EVENT = 'oneuldorak:user-profile-changed'
const USER_PROFILE_FALLBACK_AVATAR_STORAGE_KEY = 'oneuldorak:user-profile-fallback-avatar'

const PROFILE_FALLBACK_AVATARS = [carrotPro, broPro, strawPro, eggPro, bluePro]

type UserProfile = {
  email: string
  name: string
  nickname: string
  isNew?: boolean
  password?: string
  avatar?: string
}

const defaultUserProfile: UserProfile = {
  email: 'dorak_friends@oneuldorak.com',
  name: '도락이',
  nickname: '도락프렌즈',
}

function getRandomFallbackAvatar() {
  const randomIndex = Math.floor(Math.random() * PROFILE_FALLBACK_AVATARS.length)
  return PROFILE_FALLBACK_AVATARS[randomIndex]
}

function normalizeEmail(value: string | undefined) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function normalizeName(value: string | undefined) {
  return typeof value === 'string' ? value.trim() : ''
}

function readFallbackAvatar() {
  if (typeof window === 'undefined') {
    return PROFILE_FALLBACK_AVATARS[0]
  }

  const storedFallbackAvatar = window.sessionStorage.getItem(USER_PROFILE_FALLBACK_AVATAR_STORAGE_KEY)

  if (storedFallbackAvatar && PROFILE_FALLBACK_AVATARS.includes(storedFallbackAvatar)) {
    return storedFallbackAvatar
  }

  const randomFallbackAvatar = getRandomFallbackAvatar()
  window.sessionStorage.setItem(USER_PROFILE_FALLBACK_AVATAR_STORAGE_KEY, randomFallbackAvatar)

  return randomFallbackAvatar
}

let currentUserProfile = readStoredUserProfile()

function readStoredUserProfile(): UserProfile {
  const fallbackAvatar = readFallbackAvatar()

  if (typeof window === 'undefined') {
    return {
      ...defaultUserProfile,
      avatar: fallbackAvatar,
    }
  }

  const storedProfile = window.sessionStorage.getItem(USER_PROFILE_STORAGE_KEY)

  if (!storedProfile) {
    return {
      ...defaultUserProfile,
      avatar: fallbackAvatar,
    }
  }

  try {
    const parsedProfile = JSON.parse(storedProfile) as Partial<UserProfile>

    return {
      email: normalizeEmail(parsedProfile.email) || defaultUserProfile.email,
      name: normalizeName(parsedProfile.name) || defaultUserProfile.name,
      nickname: normalizeName(parsedProfile.nickname) || defaultUserProfile.nickname,
      isNew: parsedProfile.isNew,
      password: parsedProfile.password,
      avatar: parsedProfile.avatar || fallbackAvatar,
    }
  } catch {
    return {
      ...defaultUserProfile,
      avatar: fallbackAvatar,
    }
  }
}

export function saveUserProfile(profile: Partial<UserProfile>) {
  const normalizedEmail = normalizeEmail(profile.email)
  const normalizedName = normalizeName(profile.name)
  const normalizedNickname = normalizeName(profile.nickname)

  currentUserProfile = {
    ...currentUserProfile,
    ...profile,
    email: normalizedEmail || currentUserProfile.email,
    name: normalizedName || currentUserProfile.name,
    nickname: normalizedNickname || currentUserProfile.nickname,
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
