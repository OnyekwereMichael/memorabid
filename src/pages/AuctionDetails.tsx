import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  ArrowLeft,
  Users, 
  Gavel, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  DollarSign,
  FileImage,
  Home,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  CalendarDays,
  Eye,
  Tag,
  MoreVertical,
  Edit,
  Trash,
  X,
  RotateCcw
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, Auction, authAPI } from "@/lib/api";
import { getCookie, removeCookie } from "@/lib/utils";

const AuctionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookie('token');
      if (!token) return;
      const response = await authAPI.getMe(token);
      if (response.success && response.data && response.data.name) {
        setUserName(response.data.name);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      const token = getCookie('token');
      
      try {
        const response = await adminAPI.fetchAuctions(token);
        if (response.success && response.data) {
          const foundAuction = response.data.find(a => a.id === parseInt(id));
          if (foundAuction) {
            setAuction(foundAuction);
          } else {
            toast({
              title: "Auction not found",
              description: "The requested auction could not be found.",
              variant: "destructive",
            });
            navigate("/admin-dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
        toast({
          title: "Error",
          description: "Failed to load auction details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id, navigate, toast]);

  const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Auctions", url: "/admin-dashboard", icon: Gavel },
    { title: "Seller Requests", url: "/admin-dashboard", icon: Users },
    { title: "Flagged Items", url: "/admin-dashboard", icon: AlertTriangle },
    { title: "Analytics", url: "/admin-dashboard", icon: BarChart3 },
    { title: "Settings", url: "/admin-dashboard", icon: Settings },
  ];

  const handleLogout = async () => {
    const token = getCookie('token');
    const response = await authAPI.logout(token || undefined);
    if (response.success) {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your admin account.",
      });
      removeCookie('token');
      navigate("/");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default';
      case 'ending_soon': return 'warning';
      case 'ended': return 'secondary';
      case 'upcoming': return 'outline';
      case 'pending_approval': return 'outline';
      default: return 'default';
    }
  };

  const getAuctionStatus = (auction: Auction) => {
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    const endTime = new Date(auction.auction_end_time);
    
    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    
    // If less than 24 hours left
    if (endTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'ending_soon';
    return 'active';
  };

  const handleUpdateAuction = async () => {
    setActionLoading(true);
    try {
      toast({
        title: "Update Feature",
        description: "Update auction functionality will be implemented soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auction.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAuction = async () => {
    setActionLoading(true);
    try {
      toast({
        title: "Delete Feature",
        description: "Delete auction functionality will be implemented soon.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete auction.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelAuction = async () => {
    if (!auction) return;
    setActionLoading(true);
    try {
      // Update auction status to cancelled
      setAuction({ ...auction, status: 'cancelled' });
      toast({
        title: "Auction Cancelled",
        description: "The auction has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel auction.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestartAuction = async () => {
    if (!auction) return;
    setActionLoading(true);
    try {
      // Update auction status to active
      setAuction({ ...auction, status: 'active' });
      toast({
        title: "Auction Restarted",
        description: "The auction has been successfully restarted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restart auction.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getAvailableActions = (currentStatus: string) => {
    const status = currentStatus.toLowerCase();
    const actions = [];

    // Update is always available
    actions.push({ key: 'update', label: 'Update auction', icon: Edit, action: handleUpdateAuction });

    // Delete is available for upcoming or ended auctions
    if (status === 'upcoming' || status === 'ended' || status === 'cancelled') {
      actions.push({ key: 'delete', label: 'Delete auction', icon: Trash, action: handleDeleteAuction });
    }

    // Cancel is available for active or upcoming auctions
    if (status === 'active' || status === 'upcoming' || status === 'ending_soon') {
      actions.push({ key: 'cancel', label: 'Cancel auction', icon: X, action: handleCancelAuction });
    }

    // Restart is available for ended or cancelled auctions
    if (status === 'ended' || status === 'cancelled') {
      actions.push({ key: 'restart', label: 'Restart auction', icon: RotateCcw, action: handleRestartAuction });
    }

    return actions;
  };

  // Mock bid history data - in real app this would come from API
  const bidHistory = [
    { id: 1, bidder: "User123", amount: 5200, time: "2024-01-20 14:30:00" },
    { id: 2, bidder: "Collector456", amount: 5100, time: "2024-01-20 13:45:00" },
    { id: 3, bidder: "SportsFan789", amount: 5000, time: "2024-01-20 12:15:00" },
  ];

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/30 to-background">
          <Sidebar className="border-r border-border/50">
            <SidebarHeader className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">ECC</h2>
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
            <div className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-64"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="h-96 bg-muted rounded-lg"></div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-48 bg-muted rounded-lg"></div>
                    <div className="h-48 bg-muted rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!auction) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/30 to-background">
          <Sidebar className="border-r border-border/50">
            <SidebarHeader className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">ECC</h2>
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Auction Not Found</h1>
                <p className="text-muted-foreground mb-4">The requested auction could not be found.</p>
                <Button onClick={() => navigate("/admin-dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/30 to-background">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">ECC</h2>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/admin-dashboard")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold">Auction Details</h1>
                  <p className="text-muted-foreground">View and manage auction information</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Auction Header */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{auction.title}</CardTitle>
                        <CardDescription className="text-base">
                          {auction.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(auction.status || getAuctionStatus(auction)) as any}>
                          {auction.status || getAuctionStatus(auction)}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {getAvailableActions(auction.status || getAuctionStatus(auction)).map((action) => (
                              <AlertDialog key={action.key}>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer"
                                  >
                                    <action.icon className="h-4 w-4 mr-2" />
                                    {action.label}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {action.key === 'delete' ? 'Delete Auction' :
                                       action.key === 'cancel' ? 'Cancel Auction' :
                                       action.key === 'restart' ? 'Restart Auction' :
                                       'Update Auction'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {action.key === 'delete' ? 'This action cannot be undone. This will permanently delete the auction and all associated data.' :
                                       action.key === 'cancel' ? 'This will cancel the auction and stop all bidding activity.' :
                                       action.key === 'restart' ? 'This will restart the auction and allow bidding to resume.' :
                                       'This will open the update form for this auction.'}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={action.action}
                                      disabled={actionLoading}
                                      className={action.key === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
                                    >
                                      {actionLoading ? 'Processing...' : 'Confirm'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {auction.media_url ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border">
                        <img 
                          src={auction.media_url} 
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-lg border bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No image available</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Auction Details Tabs */}
                <Card className="shadow-card border-0">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="bids">Bid History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Starting Bid</p>
                              <p className="text-xl font-bold">${auction.starting_bid.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Reserve Price</p>
                              <p className="text-xl font-bold">${auction.reserve_price?.toLocaleString() || "Not Set"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Tag className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Bid Increment</p>
                              <p className="text-xl font-bold">${auction.bid_increment.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                              <p className="font-medium">
                                {new Date(auction.auction_start_time).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">End Time</p>
                              <p className="font-medium">
                                {new Date(auction.auction_end_time).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Eye className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Watchers</p>
                              <p className="font-medium">{auction.watchers || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {auction.promotional_tags && auction.promotional_tags.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h3 className="font-medium mb-3">Promotional Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {auction.promotional_tags.filter(tag => tag.trim()).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                     <TabsContent value="bids" className="p-6">
                       <div className="space-y-4">
                         <h3 className="font-medium">Recent Bids</h3>
                         {bidHistory.length > 0 ? (
                           <div className="overflow-x-auto">
                             <Table>
                               <TableHeader>
                                 <TableRow>
                                   <TableHead>Bidder</TableHead>
                                   <TableHead>Amount</TableHead>
                                   <TableHead>Time</TableHead>
                                 </TableRow>
                               </TableHeader>
                               <TableBody>
                                 {bidHistory.map((bid) => (
                                   <TableRow key={bid.id}>
                                     <TableCell className="font-medium">{bid.bidder}</TableCell>
                                     <TableCell className="font-bold text-primary">
                                       ${bid.amount.toLocaleString()}
                                     </TableCell>
                                     <TableCell className="text-muted-foreground">
                                       {new Date(bid.time).toLocaleString()}
                                     </TableCell>
                                   </TableRow>
                                 ))}
                               </TableBody>
                             </Table>
                           </div>
                         ) : (
                           <div className="text-center py-8">
                             <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                             <h3 className="font-medium mb-1">No bids yet</h3>
                             <p className="text-sm text-muted-foreground">
                               This auction hasn't received any bids yet
                             </p>
                           </div>
                         )}
                       </div>
                     </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Bid</span>
                      <span className="font-bold text-lg text-primary">
                        ${auction.current_bid?.toLocaleString() || auction.starting_bid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Bids</span>
                      <span className="font-medium">{bidHistory.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Watchers</span>
                      <span className="font-medium">{auction.watchers || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Auction Settings */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto Extend</span>
                      <Badge variant={auction.auto_extend ? "default" : "secondary"} className="text-xs">
                        {auction.auto_extend ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Featured</span>
                      <Badge variant={auction.featured ? "default" : "secondary"} className="text-xs">
                        {auction.featured ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Created By</span>
                      <span className="text-sm font-medium">{auction.seller || "Admin"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AuctionDetails;