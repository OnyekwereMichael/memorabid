import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  LogOut, 
  Search,
  TrendingUp,
  Trophy,
  Eye,
  Star,
  Filter
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const sidebarItems = [
    { title: "Dashboard", url: "/user-dashboard", icon: Home },
    { title: "My Bids", url: "/user-dashboard/bids", icon: Gavel },
    { title: "Watchlist", url: "/user-dashboard/watchlist", icon: Heart },
    { title: "Bid History", url: "/user-dashboard/history", icon: Clock },
    { title: "Profile", url: "/user-dashboard/profile", icon: User },
    { title: "Settings", url: "/user-dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  const watchlistItems = [
    { id: 1, title: "1952 Topps Mickey Mantle", currentBid: 45000, timeLeft: "2h 45m", image: "🏀" },
    { id: 2, title: "Michael Jordan Jersey", currentBid: 78000, timeLeft: "1d 12h", image: "👕" },
    { id: 3, title: "Babe Ruth Baseball", currentBid: 32000, timeLeft: "3h 21m", image: "⚾" },
  ];

  const activeBids = [
    { id: 1, title: "Vintage Baseball Card", myBid: 1200, currentBid: 1250, status: "outbid" },
    { id: 2, title: "Sports Memorabilia", myBid: 850, currentBid: 850, status: "winning" },
    { id: 3, title: "Championship Ring", myBid: 2500, currentBid: 2300, status: "winning" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/30 to-background">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Gavel className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">AuctionPro</h2>
                <p className="text-sm text-muted-foreground">User Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                  <p className="text-muted-foreground">Manage your auctions and bids</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search auctions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Bids</CardTitle>
                  <div className="text-2xl font-bold text-primary">3</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 winning
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
                  <div className="text-2xl font-bold text-primary">12</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    3 ending soon
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Won Auctions</CardTitle>
                  <div className="text-2xl font-bold text-primary">7</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3 mr-1" />
                    This month
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                  <div className="text-2xl font-bold text-primary">$15,420</div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    All time
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bids">Active Bids</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest auction activities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { action: "Placed bid", item: "Vintage Baseball Card", amount: "$1,200", time: "2 hours ago" },
                        { action: "Won auction", item: "Sports Memorabilia", amount: "$850", time: "1 day ago" },
                        { action: "Added to watchlist", item: "Championship Ring", amount: null, time: "2 days ago" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.item}</p>
                          </div>
                          <div className="text-right">
                            {activity.amount && <p className="font-semibold text-primary">{activity.amount}</p>}
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Ending Soon */}
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Ending Soon</CardTitle>
                      <CardDescription>Auctions ending in the next 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {watchlistItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{item.image}</div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">${item.currentBid.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{item.timeLeft}</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bids" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>My Active Bids</CardTitle>
                    <CardDescription>Current bidding status on your items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeBids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h3 className="font-semibold">{bid.title}</h3>
                            <p className="text-sm text-muted-foreground">Your bid: ${bid.myBid.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold">${bid.currentBid.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Current bid</p>
                            </div>
                            <Badge variant={bid.status === "winning" ? "default" : "destructive"}>
                              {bid.status === "winning" ? "Winning" : "Outbid"}
                            </Badge>
                            <Button size="sm">
                              {bid.status === "winning" ? "Increase Bid" : "Rebid"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="watchlist" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>My Watchlist</CardTitle>
                    <CardDescription>Items you're keeping an eye on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {watchlistItems.map((item) => (
                        <div key={item.id} className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-4xl mb-3 text-center">{item.image}</div>
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-primary">${item.currentBid.toLocaleString()}</span>
                            <Badge variant="outline">{item.timeLeft}</Badge>
                          </div>
                          <Button className="w-full" size="sm">Place Bid</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Bid History</CardTitle>
                    <CardDescription>Your complete bidding history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { item: "Vintage Baseball Card", finalBid: 1200, result: "Lost", date: "2024-01-15" },
                        { item: "Sports Memorabilia", finalBid: 850, result: "Won", date: "2024-01-14" },
                        { item: "Championship Ring", finalBid: 2500, result: "Won", date: "2024-01-12" },
                        { item: "Signed Basketball", finalBid: 650, result: "Lost", date: "2024-01-10" },
                      ].map((history, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h3 className="font-semibold">{history.item}</h3>
                            <p className="text-sm text-muted-foreground">{history.date}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">${history.finalBid.toLocaleString()}</span>
                            <Badge variant={history.result === "Won" ? "default" : "secondary"}>
                              {history.result}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;