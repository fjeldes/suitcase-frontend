import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

export function Map({ locations, region }: any) {
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (region) {
      mapRef.current?.animateToRegion(region, 1000)
    }
  }, [region])

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      showsUserLocation
    >
      {locations.map((loc: any) => (
        <Marker
          key={loc.id}
          coordinate={{
            latitude: Number(loc.lat),
            longitude: Number(loc.lng),
          }}
          title={loc.name}
          onPress={() => router.push(`/location/${loc.id}`)}
        />
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})