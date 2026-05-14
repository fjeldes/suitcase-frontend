// 1. Interfaces base (Ladrillos de construcción)
export interface ItemsCount {
    small: number;
    medium: number;
    large: number;
  }
  
  export interface PriceData extends ItemsCount {}
  
  export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    profile: UserProfile; // Según tu JSON, esto siempre viene si el user existe
  }
  
  export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    description: string;
    lat: string;
    lng: string;
    capacity: ItemsCount;
    pricePerDay: PriceData;
    isActive: boolean;
    image?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // 2. Interfaz Base de Booking (Campos comunes)
  export interface BaseBooking {
    id: string;
    status: 'pending' | 'confirmed' | 'in_storage' | 'completed' | 'cancelled';
    startDate: string;
    endDate: string;
    totalPrice: string;
    qrCode: string;
    items: ItemsCount;
    createdAt: string;
    updatedAt: string;
    checkedInAt: string | null;
    checkedOutAt: string | null;
    declaredValue?: number | null;
    checkInPhotos?: string[] | null;
  }
  
  /**
   * Interfaz para el flujo del Owner cuando valida un QR.
   * Mapea exactamente el JSON que mostraste anteriormente.
   */
  export interface BookingOwnerResponse extends BaseBooking {
    locationName: string;
    suggestedAction: 'check-in' | 'check-out';
    user: User;
  }
  
  /**
   * Interfaz para el flujo del Cliente (Me Bookings).
   * Aquí la locación suele venir como objeto completo.
   */
  export interface BookingData extends BaseBooking {
    location: Location;
    user: User;
    review?: unknown;
  }