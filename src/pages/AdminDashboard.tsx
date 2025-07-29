import { useState } from "react";
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

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Auctions", url: "/admin-dashboard/auctions", icon: Gavel },
    { title: "Seller Requests", url: "/admin-dashboard/sellers", icon: Users },
    { title: "Flagged Items", url: "/admin-dashboard/flagged", icon: AlertTriangle },
    { title: "Analytics", url: "/admin-dashboard/analytics", icon: BarChart3 },
    { title: "Settings", url: "/admin-dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your admin account.",
    });
    navigate("/");
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
    { id: 1, title: "1952 Topps Mickey Mantle PSA 9", seller: "VintageCards Pro", currentBid: 45000, endTime: "2h 15m", watchers: 87, status: "active" },
    { id: 2, title: "Michael Jordan Rookie Card BGS 9.5", seller: "Sports Legends", currentBid: 28500, endTime: "1d 8h", watchers: 156, status: "active" },
    { id: 3, title: "Babe Ruth Signed Baseball", seller: "Authentication Plus", currentBid: 15750, endTime: "5h 42m", watchers: 203, status: "flagged" },
  ];

  const handleApproveRejection = (sellerId: number, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Seller Approved" : "Seller Rejected",
      description: `Seller request has been ${action}d successfully.`,
    });
  };

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Auction Created",
      description: "New auction has been created successfully.",
    });
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
                <h2 className="font-semibold text-lg">AuctionPro</h2>
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
                  <h1 className="text-lg sm:text-2xl font-bold">Admin Dashboard</h1>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="1952 Topps Mickey Mantle..." required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" placeholder="Sports Cards" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Detailed description of the item..." rows={4} required />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startPrice">Starting Price ($)</Label>
                        <Input id="startPrice" type="number" placeholder="1000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                        <Input id="reservePrice" type="number" placeholder="5000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buyNow">Buy Now Price ($)</Label>
                        <Input id="buyNow" type="number" placeholder="10000" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input id="startTime" type="datetime-local" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input id="endTime" type="datetime-local" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Images/Videos</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Authentication Certificate</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload certificate file</p>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Create Auction</Button>
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
                        { action: "New auction created", item: "Vintage Baseball Card", time: "2 minutes ago", type: "auction" },
                        { action: "Seller approved", item: "VintageCards Pro", time: "15 minutes ago", type: "approval" },
                        { action: "High-value bid placed", item: "$45,000 on Mickey Mantle Card", time: "1 hour ago", type: "bid" },
                        { action: "Item flagged for review", item: "Suspicious autograph", time: "2 hours ago", type: "flag" },
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
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Current Bid</TableHead>
                          <TableHead>Time Left</TableHead>
                          <TableHead>Watchers</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeAuctions.map((auction) => (
                          <TableRow key={auction.id}>
                            <TableCell className="font-medium">{auction.title}</TableCell>
                            <TableCell>{auction.seller}</TableCell>
                            <TableCell>${auction.currentBid.toLocaleString()}</TableCell>
                            <TableCell>{auction.endTime}</TableCell>
                            <TableCell>{auction.watchers}</TableCell>
                            <TableCell>
                              <Badge variant={auction.status === 'active' ? 'default' : 'destructive'}>
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