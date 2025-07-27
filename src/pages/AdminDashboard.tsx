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
  FileImage
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
    <div className="min-h-screen bg-muted/30">
      <Navbar userRole="admin" userName="Admin User" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage auctions, users, and platform operations</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Auction
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auctions">Auctions</TabsTrigger>
            <TabsTrigger value="sellers">Seller Requests</TabsTrigger>
            <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAuctions}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAuctions}</div>
                  <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Sellers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newSellers}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
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
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Pending Seller Requests</CardTitle>
                <CardDescription>Review and approve new seller applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingSellerRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
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
            <Card>
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
              <Card>
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

              <Card>
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
    </div>
  );
};

export default AdminDashboard;