import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';

// Asumimos que la imagen del escudo naranja está en tus assets
const ShieldIcon = require('@/assets/images/logo.png'); 

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Fondo degradado imitando las burbujas oscuras */}
      <LinearGradient
        colors={['#010B4D', '#040F66', '#010940']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Contenedor del Icono con efecto de vidrio (glassmorphism) */}
        <View style={styles.iconGlassContainer}>
          <Image source={ShieldIcon} style={styles.shieldIcon} />
        </View>

        {/* Textos Principales */}
        <Text style={styles.mainTitle}>
          Secure<Text style={styles.boldText}>Transit</Text>
        </Text>
        
        <Text style={styles.subTitle}>
          Your Premium Luggage Custodian
        </Text>
      </View>

      {/* Indicador de carga inferior (la barrita naranja) */}
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBar} />
        <View style={styles.loaderBg} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -50, // Subimos un poco el contenido
  },
  iconGlassContainer: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Efecto translúcido
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 40,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shieldIcon: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 48, // Un poco más grande para el splash
    color: '#fff',
    fontWeight: '300', // Delgado para 'Secure'
    marginBottom: 10,
    letterSpacing: -1,
  },
  boldText: {
    fontWeight: '700', // Negrita para 'Transit'
  },
  subTitle: {
    fontSize: 16,
    color: '#CBD5E1', // Gris azulado claro
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    width: 100,
    height: 4,
  },
  loaderBar: {
    flex: 0.4, // El 40% es naranja
    backgroundColor: '#F97316',
    borderRadius: 2,
    zIndex: 1,
  },
  loaderBg: {
    flex: 0.6, // El 60% es gris oscuro
    backgroundColor: '#334155',
    borderRadius: 2,
    marginLeft: -2,
  },
});