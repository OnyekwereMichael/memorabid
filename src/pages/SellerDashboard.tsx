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
  Package, 
  DollarSign, 
  Eye, 
  Clock, 
  Upload,
  FileImage,
  Users,
  TrendingUp,
  CheckCircle,
  Home,
  Gavel,
  Settings,
  LogOut,
  BarChart3
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SellerDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { title: "Dashboard", url: "/seller-dashboard", icon: Home },
    { title: "My Auctions", url: "/seller-dashboard/auctions", icon: Gavel },
    { title: "Sales History", url: "/seller-dashboard/sales", icon: DollarSign },
    { title: "Analytics", url: "/seller-dashboard/analytics", icon: BarChart3 },
    { title: "Profile", url: "/seller-dashboard/profile", icon: Users },
    { title: "Settings", url: "/seller-dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your seller account.",
    });
    navigate("/");
  };

  // Mock data
  const stats = {
    totalListings: 23,
    activeAuctions: 8,
    totalEarnings: 45678,
    avgSalePrice: 1987,
    successRate: 89,
  };

  const myAuctions = [
    { id: 1, title: "1985 Jordan Rookie Card PSA 10", currentBid: 8500, startPrice: 5000, endTime: "2d 14h", watchers: 45, status: "active", bids: 23 },
    { id: 2, title: "Vintage Yankees World Series Ring", currentBid: 12750, startPrice: 8000, endTime: "1d 3h", watchers: 67, status: "active", bids: 31 },
    { id: 3, title: "Mickey Mantle Signed Photo", currentBid: 3250, startPrice: 2000, endTime: "6h 22m", watchers: 89, status: "ending_soon", bids: 18 },
  ];

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Auction Listed",
      description: "Your item has been submitted for review and will go live shortly.",
    });
  };

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
                <p className="text-sm text-muted-foreground">Seller Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Seller Tools</SidebarGroupLabel>
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
                  <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                  <p className="text-muted-foreground">Manage your listings and track performance</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 shadow-elegant">
                    <Plus className="h-4 w-4" />
                    List New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Auction Listing</DialogTitle>
                    <DialogDescription>
                      Add your memorabilia item to the auction platform
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateListing} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Item Title</Label>
                      <Input id="title" placeholder="1985 Michael Jordan Rookie Card..." required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Provide detailed information about the item's condition, provenance, and any special features..." 
                        rows={4} 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startPrice">Starting Price ($)</Label>
                        <Input id="startPrice" type="number" placeholder="500" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                        <Input id="reservePrice" type="number" placeholder="1000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buyNow">Buy Now Price ($)</Label>
                        <Input id="buyNow" type="number" placeholder="2000" />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Submit for Review</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalListings}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.activeAuctions}</div>
                  <p className="text-xs text-muted-foreground">Currently live</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">${stats.totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">After fees</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Sale Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">${stats.avgSalePrice.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per item</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">Items sold</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>My Auctions</CardTitle>
                <CardDescription>Manage your auction items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Current Bid</TableHead>
                      <TableHead>Start Price</TableHead>
                      <TableHead>Time Left</TableHead>
                      <TableHead>Watchers</TableHead>
                      <TableHead>Bids</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAuctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">{auction.title}</TableCell>
                        <TableCell>${auction.currentBid.toLocaleString()}</TableCell>
                        <TableCell>${auction.startPrice.toLocaleString()}</TableCell>
                        <TableCell>{auction.endTime}</TableCell>
                        <TableCell>{auction.watchers}</TableCell>
                        <TableCell>{auction.bids}</TableCell>
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SellerDashboard;