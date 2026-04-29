import { CapacitySection } from "@/components/owner/dashboard/CapacityCircles";
import { CurrentBookingsCard } from "@/components/owner/dashboard/CurrentBookingsCard";
import { HeaderDashboard } from "@/components/owner/dashboard/Header";
import { StatMiniCards } from "@/components/owner/dashboard/StatMiniCards";
import { UpcomingPickups } from "@/components/owner/UpcomingPickups";
import { useDashboardStats } from "@/hooks/useDashboard";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { LoadingDashboard } from "./LoadingDashboard";

export default function DashboardScreen() {
    const { data: dashboardData, isLoading, refetch } = useDashboardStats();
  
    if (isLoading || !dashboardData) return <LoadingDashboard />;
  
    const globalOccupancy = 68; // O tu lógica de cálculo
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <HeaderDashboard storeName={dashboardData.storeInfo.name} />
        
        <ScrollView 
          contentContainerStyle={{ padding: 20, gap: 20 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          <StatMiniCards 
            today={dashboardData.revenue.today} 
            yesterday={dashboardData.revenue.yesterday} 
            percentageIncrease={dashboardData.revenue.percentageIncrease} 
          
          />
  
          <CurrentBookingsCard count={dashboardData.bookings.activeCount} />

          <UpcomingPickups count={dashboardData.pickups.totalToday} nextTime={dashboardData.pickups.nextPickup?.time} nextItem={dashboardData.pickups.nextPickup?.nextItem}/>
          
          <CapacitySection data={dashboardData.occupancy} />
  
          {/* <QuickActionsMenu /> */}
        </ScrollView>
      </SafeAreaView>
    );
  }