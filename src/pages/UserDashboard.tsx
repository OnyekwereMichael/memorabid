import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Filter,
  AlertCircle,
  Users,
  Zap,
  ArrowRight
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI, adminAPI, type Auction } from "@/lib/api";
import { getCookie, removeCookie, formatAuctionTime } from "@/lib/utils";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [bidCountFilter, setBidCountFilter] = useState<string>("all");
  
  // Data states
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('token');
      if (!token) return;
      const response = await authAPI.getMe(token);
      if (response.success && response.data && response.data.name) {
        setUserName(response.data.name);
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoadingAuctions(true);
      const token = getCookie('token');
      const response = await adminAPI.fetchAuctions(token || undefined);
      if (response.success && response.data) {
        setAuctions(response.data);
        // Filter live auctions (currently active)
        const now = new Date();
        const live = response.data.filter(auction => {
          const startTime = new Date(auction.auction_start_time);
          const endTime = new Date(auction.auction_end_time);
          return startTime <= now && endTime > now;
        });
        setLiveAuctions(live);
      }
      setLoadingAuctions(false);
    };
    fetchAuctions();
  }, []);

  const sidebarItems = [
    { title: "Dashboard", url: "/user-dashboard", icon: Home },
    { title: "My Bids", url: "/user-dashboard/bids", icon: Gavel },
    { title: "Watchlist", url: "/user-dashboard/watchlist", icon: Heart },
    { title: "Bid History", url: "/user-dashboard/history", icon: Clock },
    { title: "Profile", url: "/user-dashboard/profile", icon: User },
    { title: "Settings", url: "/user-dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const token = getCookie('token');
    const response = await authAPI.logout(token || undefined);
    if (response.success) {
      toast({
        title: "Logged out successfully",
        description: response.message || "You have been logged out of your account.",
      });
      removeCookie('token');
      navigate("/");
    } else {
      toast({
        title: "Logout Failed",
        description: response.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const getAuctionStatus = (auction: Auction) => {
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    const endTime = new Date(auction.auction_end_time);
    
    if (now < startTime) return "upcoming";
    if (now > endTime) return "past";
    return "ongoing";
  };

  const getTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isEndingSoon = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 24 hours
  };

  const getMostWatched = (auction: Auction) => {
    return (auction.watchers || 0) > 10; // Adjust threshold as needed
  };

  // Filter auctions based on current filters
  const filteredAuctions = auctions.filter(auction => {
    const status = getAuctionStatus(auction);
    const currentBid = auction.current_bid || auction.starting_bid;
    const bidCount = Math.floor(Math.random() * 15) + 1; // Mock bid count
    
    // Status filter
    if (statusFilter !== "all" && status !== statusFilter) return false;
    
    // Price filter
    if (currentBid < priceRange[0] || currentBid > priceRange[1]) return false;
    
    // Bid count filter
    if (bidCountFilter === "low" && bidCount >= 5) return false;
    if (bidCountFilter === "medium" && (bidCount < 5 || bidCount > 10)) return false;
    if (bidCountFilter === "high" && bidCount <= 10) return false;
    
    // Search filter
    if (searchQuery && !auction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const categories = ["Cricket Equipment", "Memorabilia", "Vintage Items", "Signed Items", "Trophies"];

  const watchlistItems = [
    { id: 1, title: "1983 World Cup Winning Bat", currentBid: 45000, timeLeft: "2h 45m", image: "🏏" },
    { id: 2, title: "Sachin Tendulkar Jersey", currentBid: 78000, timeLeft: "1d 12h", image: "👕" },
    { id: 3, title: "Vintage Cricket Ball", currentBid: 32000, timeLeft: "3h 21m", image: "🏏" },
  ];

  const activeBids = [
    { id: 1, title: "Vintage Cricket Card", myBid: 1200, currentBid: 1250, status: "outbid" },
    { id: 2, title: "Cricket Memorabilia", myBid: 850, currentBid: 850, status: "winning" },
    { id: 3, title: "Championship Trophy", myBid: 2500, currentBid: 2300, status: "winning" },
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
                <h2 className="font-semibold text-lg">ECC</h2>
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
          <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">{loadingUser ? 'Loading...' : userName ? `Welcome, ${userName}` : ''}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">Manage your auctions and bids</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search auctions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filter Auctions</SheetTitle>
                      <SheetDescription>
                        Customize your auction search with filters
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Auction Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="past">Past</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Price Range</Label>
                        <div className="px-3">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={100000}
                            min={0}
                            step={1000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-1">
                            <span>${priceRange[0].toLocaleString()}</span>
                            <span>${priceRange[1].toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bidCount">Bid Activity</Label>
                        <Select value={bidCountFilter} onValueChange={setBidCountFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All activity levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Activity</SelectItem>
                            <SelectItem value="low">Low (1-4 bids)</SelectItem>
                            <SelectItem value="medium">Medium (5-10 bids)</SelectItem>
                            <SelectItem value="high">High (10+ bids)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setStatusFilter("all");
                          setCategoryFilter("all");
                          setPriceRange([0, 100000]);
                          setBidCountFilter("all");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            {/* Live Auction Banner */}
            {liveAuctions.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                        </div>
                        <CardTitle className="text-xl">Live Auctions</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <CardDescription>Auctions happening right now</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {liveAuctions.slice(0, 3).map((auction) => (
                        <div key={auction.id} className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold truncate">{auction.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Current: ${(auction.current_bid || auction.starting_bid).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-xs font-medium">{auction.watchers || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {getTimeLeft(auction.auction_end_time)} left
                            </Badge>
                            <Button size="sm" className="text-xs px-3">
                              Bid Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
            <Tabs defaultValue="auctions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
                <TabsTrigger value="auctions" className="text-xs sm:text-sm py-2">All Auctions</TabsTrigger>
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                <TabsTrigger value="bids" className="text-xs sm:text-sm py-2">My Bids</TabsTrigger>
                <TabsTrigger value="watchlist" className="text-xs sm:text-sm py-2">Watchlist</TabsTrigger>
                <TabsTrigger value="history" className="text-xs sm:text-sm py-2">History</TabsTrigger>
              </TabsList>

              <TabsContent value="auctions" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Available Auctions</CardTitle>
                        <CardDescription>
                          {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''} found
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Auctions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingAuctions ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex space-x-4 p-4 bg-muted/30 rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                <div className="h-3 bg-muted rounded w-1/4"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredAuctions.length === 0 ? (
                      <div className="text-center py-8">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No auctions found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredAuctions.map((auction) => {
                          const status = getAuctionStatus(auction);
                          const timeLeft = getTimeLeft(auction.auction_end_time);
                          const currentBid = auction.current_bid || auction.starting_bid;
                          const endingSoon = isEndingSoon(auction.auction_end_time);
                          const mostWatched = getMostWatched(auction);
                          
                          return (
                            <div key={auction.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                                  {auction.media_url ? (
                                    <img 
                                      src={auction.media_url} 
                                      alt={auction.title}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Gavel className="h-6 w-6 text-primary" />
                                  )}
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{auction.title}</h3>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {auction.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {endingSoon && status === "ongoing" && (
                                        <Badge variant="destructive" className="animate-pulse">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          Ending Soon
                                        </Badge>
                                      )}
                                      {mostWatched && (
                                        <Badge variant="default">
                                          <Eye className="h-3 w-3 mr-1" />
                                          Most Watched
                                        </Badge>
                                      )}
                                      <Badge 
                                        variant={
                                          status === "ongoing" ? "default" : 
                                          status === "upcoming" ? "secondary" : "outline"
                                        }
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <p className="text-lg font-bold text-primary">
                                          ${currentBid.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Current Bid</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">{timeLeft}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {status === "past" ? "Ended" : "Time Left"}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{auction.watchers || 0}</span>
                                        <span className="text-xs text-muted-foreground">watching</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Button variant="outline" size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        Watch
                                      </Button>
                                      {status === "ongoing" && (
                                        <Button size="sm" className="font-semibold">
                                          Place Bid
                                        </Button>
                                      )}
                                      {status === "upcoming" && (
                                        <Button variant="secondary" size="sm">
                                          Set Reminder
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

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
                        { action: "Placed bid", item: "Vintage Cricket Card", amount: "$1,200", time: "2 hours ago" },
                        { action: "Won auction", item: "Cricket Memorabilia", amount: "$850", time: "1 day ago" },
                        { action: "Added to watchlist", item: "Championship Trophy", amount: null, time: "2 days ago" },
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
                        <div key={bid.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{bid.title}</h3>
                            <p className="text-sm text-muted-foreground">Your bid: ${bid.myBid.toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="text-left sm:text-right">
                              <p className="font-semibold">${bid.currentBid.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Current bid</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={bid.status === "winning" ? "default" : "destructive"}>
                                {bid.status === "winning" ? "Winning" : "Outbid"}
                              </Badge>
                              <Button size="sm" className="whitespace-nowrap">
                                {bid.status === "winning" ? "Increase Bid" : "Rebid"}
                              </Button>
                            </div>
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
                        { item: "Vintage Cricket Card", finalBid: 1200, result: "Lost", date: "2024-01-15" },
                        { item: "Cricket Memorabilia", finalBid: 850, result: "Won", date: "2024-01-14" },
                        { item: "Championship Trophy", finalBid: 2500, result: "Won", date: "2024-01-12" },
                        { item: "Signed Cricket Bat", finalBid: 650, result: "Lost", date: "2024-01-10" },
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