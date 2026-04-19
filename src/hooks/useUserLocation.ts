import { useLocationStore } from '@/store/useLocationStore'
import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

export function useUserLocation() {
  const [location, setLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [loading, setLoading] = useState(false) // Agregamos estado loading

  const setLocationStore = useLocationStore((state) => state.setLocation)

  // Usamos useCallback para que la función sea estable
  const getLocation = useCallback(async () => {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      const loc = await Location.getCurrentPositionAsync({})
      const coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      }

      setLocation(coords)
      setLocationStore({
        address: 'Ubicación actual',
        lat: coords.lat.toString(),
        lng: coords.lng.toString(),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [setLocationStore])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  return { 
    location,
    lat: location?.lat, 
    lng: location?.lng, 
    getLocation, 
    loading 
  }
}