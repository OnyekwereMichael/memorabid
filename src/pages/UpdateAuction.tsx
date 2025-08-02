import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Save,
  Upload,
  X,
  CalendarDays,
  DollarSign,
  FileImage,
  Shield,
  Home,
  Gavel,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
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
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, Auction, authAPI } from "@/lib/api";
import { getCookie, removeCookie } from "@/lib/utils";

const UpdateAuction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_bid: 0,
    reserve_price: 0,
    bid_increment: 0,
    auction_start_time: "",
    auction_end_time: "",
    auto_extend: false,
    featured: false,
    promotional_tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  const sidebarItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Auctions", url: "/admin-dashboard", icon: Gavel },
    { title: "Seller Requests", url: "/admin-dashboard", icon: Users },
    { title: "Flagged Items", url: "/admin-dashboard", icon: AlertTriangle },
    { title: "Analytics", url: "/admin-dashboard", icon: BarChart3 },
    { title: "Settings", url: "/admin-dashboard", icon: Settings },
  ];

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
            // Pre-fill form with current auction data
            setFormData({
              title: foundAuction.title,
              description: foundAuction.description,
              starting_bid: foundAuction.starting_bid,
              reserve_price: foundAuction.reserve_price || 0,
              bid_increment: foundAuction.bid_increment,
              auction_start_time: new Date(foundAuction.auction_start_time).toISOString().slice(0, 16),
              auction_end_time: new Date(foundAuction.auction_end_time).toISOString().slice(0, 16),
              auto_extend: foundAuction.auto_extend,
              featured: foundAuction.featured,
              promotional_tags: foundAuction.promotional_tags || [],
            });
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.promotional_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        promotional_tags: [...prev.promotional_tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      promotional_tags: prev.promotional_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!auction) return;

    setSaving(true);
    const token = getCookie('token');
    
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        starting_bid: formData.starting_bid,
        reserve_price: formData.reserve_price,
        bid_increment: formData.bid_increment,
        auction_start_time: formData.auction_start_time,
        auction_end_time: formData.auction_end_time,
        auto_extend: formData.auto_extend,
        featured: formData.featured,
        promotional_tags: formData.promotional_tags,
      };

      const response = await adminAPI.updateAuction(auction.id, updateData, token);
      
      if (response.success) {
        toast({
          title: "Auction Updated",
          description: "The auction has been successfully updated.",
        });
        navigate(`/auction-details/${auction.id}`);
      } else {
        toast({
          title: "Update Failed",
          description: response.message || "Failed to update auction.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating auction:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the auction.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
                <div className="h-96 bg-muted rounded-lg"></div>
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
                  onClick={() => navigate(`/auction-details/${auction.id}`)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Details
                </Button>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold">Update Auction</h1>
                  <p className="text-muted-foreground">Edit auction information and settings</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="mx-auto space-y-6">
              {/* Basic Information */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Update the main details of your auction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Auction Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter auction title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the auction item"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Bidding */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing & Bidding
                  </CardTitle>
                  <CardDescription>
                    Set pricing and bidding parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="starting_bid">Starting Bid ($)</Label>
                    <Input
                      id="starting_bid"
                      type="number"
                      value={formData.starting_bid}
                      onChange={(e) => handleInputChange('starting_bid', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reserve_price">Reserve Price ($)</Label>
                    <Input
                      id="reserve_price"
                      type="number"
                      value={formData.reserve_price}
                      onChange={(e) => handleInputChange('reserve_price', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bid_increment">Bid Increment ($)</Label>
                    <Input
                      id="bid_increment"
                      type="number"
                      value={formData.bid_increment}
                      onChange={(e) => handleInputChange('bid_increment', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Timing */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Auction Timing
                  </CardTitle>
                  <CardDescription>
                    Set start and end times for the auction
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={formData.auction_start_time}
                      onChange={(e) => handleInputChange('auction_start_time', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={formData.auction_end_time}
                      onChange={(e) => handleInputChange('auction_end_time', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Settings & Tags */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Settings & Promotional Tags</CardTitle>
                  <CardDescription>
                    Configure auction settings and add promotional tags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Extend</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically extend auction time when bids are placed near the end
                      </p>
                    </div>
                    <Switch
                      checked={formData.auto_extend}
                      onCheckedChange={(checked) => handleInputChange('auto_extend', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Featured Auction</Label>
                      <p className="text-sm text-muted-foreground">
                        Display this auction prominently on the platform
                      </p>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Promotional Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.promotional_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.promotional_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Media Section */}
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Media
                  </CardTitle>
                  <CardDescription>
                    Current auction image (upload functionality coming soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auction.media_url ? (
                    <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                      <img 
                        src={auction.media_url} 
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full max-w-md rounded-lg border bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No image available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UpdateAuction;