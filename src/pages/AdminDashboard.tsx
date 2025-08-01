import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Plus, 
  Users, 
  Gavel, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Check, 
  X, 
  Upload,
  DollarSign,
  Clock,
  FileImage,
  Home,
  Settings,
  LogOut,
  BarChart3,
  Shield
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI, adminAPI, CreateAuctionData, Auction } from "@/lib/api";
import { getCookie, removeCookie } from "@/lib/utils";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [auctionFormData, setAuctionFormData] = useState<CreateAuctionData>({
    name: "", // Add this field
    description: "",
    auction_start_time: "",
    auction_end_time: "",
    starting_bid: 0,
    reserve_price: 0,
    bid_increment: 1,
    auto_extend: false,
    featured: false,
    promotional_tags: ["", "", ""],
    images: [],
  });
  const [isCreatingAuction, setIsCreatingAuction] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
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

    // Add this new effect to fetch auctions
    const fetchAuctions = async () => {
      setLoadingAuctions(true);
      const token = getCookie('token');
      if (!token) return;
      
      const response = await adminAPI.fetchAuctions(token);
      if (response.success && response.data) {
        setAuctions(response.data);
      } else {
        toast({
          title: "Failed to fetch auctions",
          description: response.message || "Could not load auction data",
          variant: "destructive",
        });
      }
      setLoadingAuctions(false);
    };
    
    fetchAuctions();
  }, []);

  const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Auctions", url: "/admin-dashboard/auctions", icon: Gavel },
    { title: "Seller Requests", url: "/admin-dashboard/sellers", icon: Users },
    { title: "Flagged Items", url: "/admin-dashboard/flagged", icon: AlertTriangle },
    { title: "Analytics", url: "/admin-dashboard/analytics", icon: BarChart3 },
    { title: "Settings", url: "/admin-dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const token = getCookie('token');
    const response = await authAPI.logout(token || undefined);
    if (response.success) {
      toast({
        title: "Logged out successfully",
        description: response.message || "You have been logged out of your admin account.",
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

  // Mock data
  const stats = {
    totalAuctions: 847,
    activeAuctions: 23,
    pendingApprovals: 7,
    totalRevenue: 2456789,
    newSellers: 12,
  };

  const pendingSellerRequests = [
    { id: 1, name: "John Smith", email: "john@example.com", businessName: "Vintage Sports Cards", description: "15 years collecting vintage baseball cards", submittedAt: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", businessName: "Memorabilia Experts", description: "Licensed dealer specializing in authenticated sports memorabilia", submittedAt: "2024-01-14" },
    { id: 3, name: "Mike Davis", email: "mike@example.com", businessName: "", description: "Personal collection of rare coins and stamps", submittedAt: "2024-01-13" },
  ];

  const activeAuctions = [
    { id: 1, title: "1983 World Cup Winning Bat", seller: "Cricket Legends", currentBid: 45000, endTime: "2h 15m", watchers: 87, status: "active" },
    { id: 2, title: "Sachin Tendulkar Signed Jersey", seller: "Cricket Museum", currentBid: 28500, endTime: "1d 8h", watchers: 156, status: "active" },
    { id: 3, title: "Vintage Cricket Ball Collection", seller: "Heritage Cricket", currentBid: 15750, endTime: "5h 42m", watchers: 203, status: "flagged" },
  ];

  const handleApproveRejection = (sellerId: number, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Seller Approved" : "Seller Rejected",
      description: `Seller request has been ${action}d successfully.`,
    });
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bid increment
    if (auctionFormData.bid_increment <= 0 || isNaN(auctionFormData.bid_increment)) {
      toast({
        title: "Invalid Bid Increment",
        description: "Bid increment must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate auction end time is after start time
    const startTime = new Date(auctionFormData.auction_start_time);
    const endTime = new Date(auctionFormData.auction_end_time);
    
    if (endTime <= startTime) {
      toast({
        title: "Invalid Auction End Time",
        description: "The auction end time must be a date after auction start time.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingAuction(true);
    
    try {
      const token = getCookie('token');
      const response = await adminAPI.createAuction(auctionFormData, token || undefined);
      
      if (response.success) {
        toast({
          title: "Auction Created Successfully!",
          description: response.message || "New auction has been created successfully.",
        });
        // Reset form
        setAuctionFormData({
          description: "",
          auction_start_time: "",
          auction_end_time: "",
          starting_bid: 0,
          reserve_price: 0,
          bid_increment: 1,
          auto_extend: false,
          featured: false,
          promotional_tags: ["", "", ""],
          images: [],
          name: ""
        });
      } else {
        toast({
          title: "Auction Creation Failed",
          description: response.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auction creation error:", error);
      toast({
        title: "Auction Creation Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAuction(false);
    }
  };

  const handleInputChange = (field: keyof CreateAuctionData, value: any) => {
    // Add validation for bid_increment
    if (field === 'bid_increment') {
      // Ensure bid increment is a positive number greater than 0
      if (typeof value === 'number' && (value <= 0 || isNaN(value))) {
        toast({
          title: "Invalid Bid Increment",
          description: "Bid increment must be greater than zero.",
          variant: "destructive",
        });
        // Set a valid default value
        value = 1;
      }
    }
    
    setAuctionFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePromotionalTagChange = (index: number, value: string) => {
    const newTags = [...auctionFormData.promotional_tags];
    newTags[index] = value;
    setAuctionFormData(prev => ({ ...prev, promotional_tags: newTags }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAuctionFormData(prev => ({ ...prev, images: filesArray }));
    }
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <SidebarTrigger />
                <div>
                <h1 className="text-lg sm:text-2xl font-bold">{loadingUser ? 'Loading...' : userName ? `Welcome, ${userName}` : ''}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">Manage auctions, sellers, and platform operations</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 shadow-elegant w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create Auction</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Auction</DialogTitle>
                    <DialogDescription>
                      Add a new auction item to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateAuction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Auction Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter auction item name..." 
                        value={auctionFormData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Detailed description of the auction item..." 
                        rows={4} 
                        value={auctionFormData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auction_start_time">Auction Start Time</Label>
                        <Input 
                          id="auction_start_time" 
                          type="datetime-local" 
                          value={auctionFormData.auction_start_time}
                          onChange={(e) => handleInputChange('auction_start_time', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auction_end_time">Auction End Time</Label>
                        <Input 
                          id="auction_end_time" 
                          type="datetime-local" 
                          value={auctionFormData.auction_end_time}
                          onChange={(e) => handleInputChange('auction_end_time', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="starting_bid">Starting Bid ($)</Label>
                        <Input 
                          id="starting_bid" 
                          type="number" 
                          placeholder="1000" 
                          value={auctionFormData.starting_bid}
                          onChange={(e) => handleInputChange('starting_bid', parseFloat(e.target.value) || 0)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reserve_price">Reserve Price ($)</Label>
                        <Input 
                          id="reserve_price" 
                          type="number" 
                          placeholder="5000" 
                          value={auctionFormData.reserve_price}
                          onChange={(e) => handleInputChange('reserve_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bid_increment">Bid Increment ($)</Label>
                        <Input 
                          id="bid_increment" 
                          type="number" 
                          placeholder="100" 
                          value={auctionFormData.bid_increment}
                          onChange={(e) => handleInputChange('bid_increment', parseFloat(e.target.value) || 1)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="auto_extend"
                          checked={auctionFormData.auto_extend}
                          onChange={(e) => handleInputChange('auto_extend', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="auto_extend">Auto Extend</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={auctionFormData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="featured">Featured Auction</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Promotional Tags</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input 
                          placeholder="Tag 1" 
                          value={auctionFormData.promotional_tags[0]}
                          onChange={(e) => handlePromotionalTagChange(0, e.target.value)}
                        />
                        <Input 
                          placeholder="Tag 2" 
                          value={auctionFormData.promotional_tags[1]}
                          onChange={(e) => handlePromotionalTagChange(1, e.target.value)}
                        />
                        <Input 
                          placeholder="Tag 3" 
                          value={auctionFormData.promotional_tags[2]}
                          onChange={(e) => handlePromotionalTagChange(2, e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Images (Max 4)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="max-w-xs mx-auto"
                        />
                        {auctionFormData.images.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {auctionFormData.images.length} image(s) selected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isCreatingAuction}>
                      {isCreatingAuction ? "Creating Auction..." : "Create Auction"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>
       
          <div className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                <TabsTrigger value="auctions" className="text-xs sm:text-sm py-2">Auctions</TabsTrigger>
                <TabsTrigger value="sellers" className="text-xs sm:text-sm py-2 hidden sm:block">Sellers</TabsTrigger>
                <TabsTrigger value="flagged" className="text-xs sm:text-sm py-2">Flagged</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Card className="shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                      <Gavel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.totalAuctions}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.activeAuctions}</div>
                      <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.pendingApprovals}</div>
                      <p className="text-xs text-muted-foreground">Needs attention</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">${stats.totalRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+23% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Sellers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{stats.newSellers}</div>
                      <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "New auction created", item: "Vintage Cricket Bat", time: "2 minutes ago", type: "auction" },
                        { action: "Seller approved", item: "Cricket Legends", time: "15 minutes ago", type: "approval" },
                        { action: "High-value bid placed", item: "$45,000 on World Cup Bat", time: "1 hour ago", type: "bid" },
                        { action: "Item flagged for review", item: "Suspicious signature", time: "2 hours ago", type: "flag" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'auction' ? 'bg-primary' :
                            activity.type === 'approval' ? 'bg-success' :
                            activity.type === 'bid' ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.item}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="auctions" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>All Auctions</CardTitle>
                    <CardDescription>Manage all auction items on the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Title</TableHead>
                            <TableHead className="min-w-[120px]">Seller</TableHead>
                            <TableHead className="min-w-[100px]">Current Bid</TableHead>
                            <TableHead className="min-w-[100px]">Time Left</TableHead>
                            <TableHead className="min-w-[80px]">Watchers</TableHead>
                            <TableHead className="min-w-[80px]">Status</TableHead>
                            <TableHead className="min-w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auctions.map((auction) => (
                            <TableRow key={auction.id}>
                              <TableCell className="font-medium">{auction.title}</TableCell>
                              <TableCell>{auction.seller || 'N/A'}</TableCell>
                              <TableCell>${auction.current_bid?.toLocaleString() || auction.starting_bid.toLocaleString()}</TableCell>
                              <TableCell>{calculateTimeLeft(auction.auction_end_time)}</TableCell>
                              <TableCell>{auction.watchers || 0}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(auction) as "default" | "destructive" | "outline" | "secondary"}>
                                  {/* {getAuctionStatus(auction)} */}
                                  {auction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellers" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Pending Seller Requests</CardTitle>
                    <CardDescription>Review and approve new seller applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingSellerRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{request.name}</h4>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              {request.businessName && (
                                <p className="text-sm font-medium text-primary">{request.businessName}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveRejection(request.id, 'approve')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveRejection(request.id, 'reject')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {request.submittedAt}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flagged" className="space-y-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle>Flagged Items</CardTitle>
                    <CardDescription>Review items that need manual attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No flagged items</h3>
                      <p className="text-muted-foreground">All auctions are currently running smoothly</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                      <CardDescription>Key metrics overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Sales Volume</span>
                          <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Auction Value</span>
                          <span className="font-medium">$2,900</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Success Rate</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Users</span>
                          <span className="font-medium">1,247</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardHeader>
                      <CardTitle>Recent Trends</CardTitle>
                      <CardDescription>Growth indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm">Monthly revenue up 23%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm">New user registrations up 15%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm">Average bid amount up 8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;


const calculateTimeLeft = (endTime: string) => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
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

const getStatusVariant = (auction: Auction) => {
  const status = getAuctionStatus(auction);
  switch (status) {
    case 'active': return 'default';
    case 'ending_soon': return 'warning';
    case 'ended': return 'secondary';
    case 'upcoming': return 'outline';
    default: return 'default';
  }
};