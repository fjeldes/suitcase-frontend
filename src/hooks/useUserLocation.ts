import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') return

    const loc = await Location.getCurrentPositionAsync({})

    setLocation({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    })
  }

  return location
}