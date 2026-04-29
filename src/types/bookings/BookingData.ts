// 1. Interfaces base (Los "ladrillos" de construcción)
export interface ItemsCount {
    large: number;
    medium: number;
    small: number;
  }
  
  export interface PriceData extends ItemsCount {} // Si son iguales, heredamos
  
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
    profile: UserProfile;
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
    createdAt: string;
    updatedAt: string;
  }
  
  // 2. Interfaz Base de Booking (Lo que siempre existe)
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
  }
  
  export interface BookingData extends BaseBooking {
    checkedInAt: string | null;
    checkedOutAt: string | null;
    location: Location;
    user: User;
  }