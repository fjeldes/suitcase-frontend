import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Notifications.style";

interface NotificationItemProps {
  type: 'CRITICAL' | 'LOG' | 'SYSTEM';
  title: string;
  time: string;
  description: string;
  isUnread?: boolean;
  showButtons?: boolean;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const NotificationItem = ({
  type,
  title,
  time,
  description,
  isUnread,
  showButtons,
  onPrimaryPress,
  onSecondaryPress
}: NotificationItemProps) => {

  // Determinamos el icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'CRITICAL': return 'shield-checkmark';
      case 'SYSTEM': return 'settings-outline';
      default: return 'document-text-outline';
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        {/* Contenedor del Icono */}
        <View style={[
          styles.iconBg,
          type === 'CRITICAL' ? styles.criticalIcon : styles.logIcon
        ]}>
          <Ionicons
            name={getIcon()}
            size={22}
            color={type === 'CRITICAL' ? '#E53E3E' : '#94A3B8'}
          />
        </View>

        {/* Contenido de Texto */}
        <View style={styles.textMainContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.itemTime}>{time}</Text>
          </View>
          <Text style={styles.itemDescription}>{description}</Text>
        </View>

        {/* Indicador de "No leído" - La barrita roja lateral de la imagen */}
        {isUnread && <View style={styles.unreadIndicator} />}
      </View>

      {/* Fila de Botones */}
      {showButtons && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onPrimaryPress}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Review Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onSecondaryPress}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};