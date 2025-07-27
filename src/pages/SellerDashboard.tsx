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
  Plus, 
  Package, 
  DollarSign, 
  Eye, 
  Clock, 
  Upload,
  FileImage,
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const SellerDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
    { id: 4, title: "1952 Topps Willie Mays", currentBid: 0, startPrice: 3500, endTime: "Ended", watchers: 12, status: "unsold", bids: 0 },
    { id: 5, title: "Babe Ruth Game-Used Bat", currentBid: 25000, startPrice: 15000, endTime: "Sold", watchers: 156, status: "sold", bids: 87 },
  ];

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Auction Listed",
      description: "Your item has been submitted for review and will go live shortly.",
    });
  };

  const handleFulfillment = (auctionId: number) => {
    toast({
      title: "Fulfillment Confirmed",
      description: "You've confirmed the item has been shipped to the buyer.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'ending_soon': return 'destructive';
      case 'sold': return 'secondary';
      case 'unsold': return 'outline';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'ending_soon': return 'Ending Soon';
      case 'sold': return 'Sold';
      case 'unsold': return 'Unsold';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar userRole="seller" userName="Seller User" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and track performance</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
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
                    <p className="text-xs text-muted-foreground">Minimum acceptable price</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyNow">Buy Now Price ($)</Label>
                    <Input id="buyNow" type="number" placeholder="2000" />
                    <p className="text-xs text-muted-foreground">Optional instant purchase</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Auction Start</Label>
                    <Input id="startTime" type="datetime-local" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Auction End</Label>
                    <Input id="endTime" type="datetime-local" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Photos/Videos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop up to 10 images or videos</p>
                    <Button type="button" variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">High-quality images increase bidding activity</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Authentication Certificate</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload certificate of authenticity (required for high-value items)</p>
                    <Button type="button" variant="outline" size="sm" className="mt-2">
                      Upload Certificate
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Submit for Review</Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your listing will be reviewed by our team before going live (usually within 24 hours)
                </p>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="sales">Sales History</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalListings}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                  <p className="text-xs text-muted-foreground">Currently live</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">After fees</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Sale Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.avgSalePrice.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per item</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">Items sold</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Auctions</CardTitle>
                  <CardDescription>Your items currently receiving bids</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myAuctions.filter(auction => auction.status === 'active' || auction.status === 'ending_soon').slice(0, 3).map((auction) => (
                      <div key={auction.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{auction.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Current: ${auction.currentBid.toLocaleString()} • {auction.watchers} watchers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{auction.endTime}</p>
                          <Badge variant={getStatusColor(auction.status)} className="text-xs">
                            {getStatusText(auction.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                  <CardDescription>Your performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Items Listed</span>
                      <span className="font-medium">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Items Sold</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenue</span>
                      <span className="font-medium">$12,350</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Watchers</span>
                      <span className="font-medium">267</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
                <CardDescription>Manage your auction items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Current/Final Price</TableHead>
                      <TableHead>Start Price</TableHead>
                      <TableHead>Time Left/Ended</TableHead>
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
                          <Badge variant={getStatusColor(auction.status)}>
                            {getStatusText(auction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {auction.status === 'sold' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleFulfillment(auction.id)}
                              >
                                Fulfill
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Your completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myAuctions.filter(auction => auction.status === 'sold').map((sale) => (
                    <div key={sale.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{sale.title}</h4>
                        <Badge variant="secondary">Sold</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Final Price</p>
                          <p className="font-medium">${sale.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Bids</p>
                          <p className="font-medium">{sale.bids}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Watchers</p>
                          <p className="font-medium">{sale.watchers}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Key metrics for your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Selling Price</span>
                      <span className="font-medium">${stats.avgSalePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Watchers per Item</span>
                      <span className="font-medium">67</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Bids per Item</span>
                      <span className="font-medium">32</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time to First Bid</span>
                      <span className="font-medium">4.2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Your best performing item types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sports Cards</span>
                      <span className="font-medium">$28,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Autographed Items</span>
                      <span className="font-medium">$15,220</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Game-Used Equipment</span>
                      <span className="font-medium">$2,008</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;