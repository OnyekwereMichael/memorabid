import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Gavel, 
  Heart, 
  Clock, 
  User, 
  Settings, 
  LogOut
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { removeCookie, isAuthenticated, getCookie } from "@/lib/utils";

interface UserInfo {
  username: string;
  email: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
useEffect(() => {
  const fetchUser = async () => {
    const token = getCookie('token');
    if (!token) {
      setLoading(false); // even if not authenticated, stop loading
      return;
    }

    try {
      const response = await authAPI.getMe(token);
      if (response.success && response.data?.name) {
        setUserName(response.data.name);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  console.log("User Name:", userName);
  
  
  // useEffect(() => {
  //   fetchUserData();
  // }, []);



  // Navigation items
  const navItems = [
    { title: "Dashboard", url: "/user-dashboard", icon: Home },
    { title: "Auctions", url: "/auction", icon: Gavel },
    { title: "Watchlist", url: "/user-dashboard", icon: Heart },
    { title: "History", url: "/user-dashboard", icon: Clock },
    { title: "Profile", url: "/user-dashboard", icon: User },
    { title: "Settings", url: "/user-dashboard", icon: Settings },
  ];

  const handleLogout = () => {
    removeCookie('token');
    removeCookie('role');
    navigate('/');
  };

  const handleAuctionNavigation = () => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      navigate('/auction');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64">
          <SidebarHeader className="p-6 border-b">
            <h2 className="text-lg font-semibold">User Dashboard</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild={item.title !== "Auctions"}
                        className={item.title === "Dashboard" ? "bg-accent" : ""}
                        onClick={item.title === "Auctions" ? handleAuctionNavigation : undefined}
                      >
                        {item.title === "Auctions" ? (
                          <div className="flex items-center gap-3 cursor-pointer">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                        ) : (
                          <a href={item.url} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4 border-t">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back{userName ? `, ${userName}` : ''}!
                </h1>
                <p className="text-muted-foreground">Manage your auctions and bids</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-lg">Loading dashboard...</div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    Navigate to "Auctions" to view and bid on available items
                  </p>
                  <Button onClick={handleAuctionNavigation}>
                    Go to Auctions
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;