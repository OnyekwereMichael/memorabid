import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  ArrowLeft,
  Users, 
  Gavel, 
  TrendingUp, 
  Clock,
  DollarSign,
  FileImage,
  Plus,
  Zap,
  Eye,
  Tag,
  Heart,
  Share2,
  Timer,
  Trophy,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, Auction, auctionAPI } from "@/lib/api";
import { getCookie } from "@/lib/utils";
import { log } from "node:console";
import { useAuctionStatus } from "./ActiveAuction";

interface Bid {
  id: number;
  bidder: string;
  bid_amount: number;
  time: string;
  isAutoBid?: boolean;
}

const AuctionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bid_amount, setAmount] = useState<number>(0);
  const [maxAutoBid, setMaxAutoBid] = useState<number>(0);
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [bidData, setBidData] = useState<{ [key: string]: any }>({});
  const [showAutoBidPanel, setShowAutoBidPanel] = useState(false);
   const [startHours, setStartHours] = useState(0);
  const [endHours, setEndHours] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const getHoursRemaining = (targetTime: string) => {
        const now = new Date();
        const target = new Date(targetTime);
        return (target - now) / (1000 * 60 * 60);
      };

      setStartHours(getHoursRemaining(auction.auction_start_time));
      setEndHours(getHoursRemaining(auction.auction_end_time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => clearInterval(interval);
  }, [auction]);






  
 
  // Fetch auction details from API
  useEffect(() => {
    const getAuctionDetails = async () => {
      const token = getCookie('token');
      if (!token || !id) return;

      try {
        const result = await auctionAPI.fetchAuctionById(id, token);
        if (result && result.data && result.data.auction) {
          const apiAuction = result.data.auction;
          // Parse promotional_tags if it's a stringified array
          let tags: string[] = [];
          try {
            tags = apiAuction.promotional_tags
              ? JSON.parse(apiAuction.promotional_tags)
              : [];
          } catch {
            tags = [];
          }
          setAuction({
            id: apiAuction.id,
            title: apiAuction.title,
            description: apiAuction.description,
            starting_bid: Number(apiAuction.starting_bid),
            reserve_price: Number(apiAuction.reserve_price),
            bid_increment: isNaN(Number(apiAuction.bid_increment)) ? 100 : Number(apiAuction.bid_increment),
            auction_start_time: apiAuction.auction_start_time,
            auction_end_time: apiAuction.auction_end_time,
            media_url: apiAuction.media_url || "",
            watchers: apiAuction.watchers || 0,
            promotional_tags: tags,
            auto_extend: apiAuction.auto_extend,
            featured: apiAuction.featured,
            status: apiAuction.status,
            current_bid: result.data.highest_bid ? Number(result.data.highest_bid) : Number(apiAuction.starting_bid),
            user: apiAuction.creator
              ? {
                  id: apiAuction.creator.id,
                  name: apiAuction.creator.name,
                  email: apiAuction.creator.email,
                  role: apiAuction.creator.role || "seller",
                }
              : { id: 0, name: "Unknown", email: "", role: "seller" },
          } as Auction);

          // Set bid history if available
          if (apiAuction.bids && Array.isArray(apiAuction.bids)) {
            setBidHistory(
              apiAuction.bids.map((b: any, idx: number) => ({
                id: b.id || idx,
                bidder: b.bidder_name || "Bidder",
                bid_amount: Number(b.bid_amount),
                time: b.created_at || new Date().toISOString(),
                isAutoBid: b.is_auto_bid || false,
              }))
            );
          } else {
            setBidHistory([]);
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

    getAuctionDetails();
  }, [id, toast]);

  // Update countdown timer
  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.auction_end_time);
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': 
      case 'active': return 'default';
      case 'ending_soon': return 'destructive';
      case 'ended': return 'secondary';
      case 'upcoming': return 'outline';
      default: return 'default';
    }
  };

  function isAuctionActive(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  return now >= start && now <= end;
}

const active = isAuctionActive(auction.auction_start_time, auction.auction_end_time);

console.log(active); 

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

 const handleIncrementBid = () => {
  if (!auction) return;
  const currentBid = auction.current_bid || auction.starting_bid;
  const nextBid = Math.max(bid_amount + auction.bid_increment, currentBid + auction.bid_increment);
  setAmount(nextBid);
};

  const handlePlaceBid = async () => {
    if (!auction) return;

    const token = getCookie('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place a bid.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const currentBid = auction.current_bid || auction.starting_bid;
    const minBid = currentBid + auction.bid_increment;

    if (bid_amount < minBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid is $${minBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setBidLoading(true);

    try {
      // Correct: send auction.id and bidAmount as separate arguments!
      const response = await auctionAPI.placeBid(
        auction.id,
        bid_amount,
        token
      );

      if (response.success) {
        toast({
          title: "Bid Placed Successfully!",
          description: `Your bid of $${bid_amount.toLocaleString()} has been placed.`,
        });

        // Optionally update UI...
        const newBid: Bid = {
          id: bidHistory.length + 1,
          bidder: "You",
          bid_amount: <a href="#">{bid_amount}</a>,
          time: new Date().toISOString(),
        };
        setBidHistory([newBid, ...bidHistory]);
        setAuction({ ...auction, current_bid: bid_amount });

        // setAmount(bid_amount + auction.bid_increment);
      } else {
        toast({
          title: "Bid Failed",
          description: response.message || "Failed to place bid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBidLoading(false);
    }
  };

  const handleSetupAutoBid = async () => {
    if (!auction || maxAutoBid <= 0) return;
    
    const currentBid = auction.current_bid || auction.starting_bid;
    
    if (maxAutoBid <= currentBid) {
      toast({
        title: "Invalid Auto-Bid",
        description: `Auto-bid maximum must be higher than current bid of $${currentBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAutoBidEnabled(true);
      toast({
        title: "Auto-Bid Activated!",
        description: `Auto-bid set up to $${maxAutoBid.toLocaleString()}`,
      });
      
    } catch (error) {
      toast({
        title: "Auto-Bid Setup Failed",
        description: "Failed to set up auto-bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWatch = () => {
    setIsWatching(!isWatching);
    if (!auction) return;
    
    const newWatcherCount = isWatching ? 
      (auction.watchers || 0) - 1 : 
      (auction.watchers || 0) + 1;
    
    setAuction({ ...auction, watchers: newWatcherCount });
    
    toast({
      title: isWatching ? "Removed from Watchlist" : "Added to Watchlist",
      description: isWatching ? 
        "You will no longer receive updates for this auction." :
        "You will receive notifications about this auction.",
    });
  };



useEffect(() => {
  const getBids = async () => {
    const token = getCookie('token');
    if (!token || !id) return;

    try {
      const result = await auctionAPI.fetchBidsByAuctionId(id, token); // pass token
      console.log("Fetched bids:", result);
      setBidData(result.data || {});
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  getBids();
}, [id]);

console.log("Bid Data:", bidData);

useEffect(() => {
  const getAuctionDetails = async () => {
    const token = getCookie('token');
    if (!token || !id) return;

    try {
      const result = await auctionAPI.fetchAuctionById(id, token); // pass token
      console.log("Fetched auction details:", result);
    } catch (error) {
      console.error("Error fetching auction details:", error);
    }
  };

  getAuctionDetails();
}, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Auction Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested auction could not be found.</p>
          <Button onClick={() => navigate("/auction")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  const currentBid = auction.current_bid || auction.starting_bid;
  const minNextBid = currentBid + auction.bid_increment;
  const auctionStatus = auction.status || getAuctionStatus(auction);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auction")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Auctions
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleWatch}
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${isWatching ? 'fill-current text-red-500' : ''}`} />
              {isWatching ? 'Watching' : 'Watch'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Header */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl">{auction.title}</CardTitle>
                      <Badge variant={getStatusVariant(auctionStatus) as any} className="text-sm">
                        {auctionStatus}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      Sold by {auction.user.name}
                    </p>
                    <CardDescription className="text-base leading-relaxed">
                      {auction.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Product Image */}
                {auction.media_url ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border mb-6">
                    <img 
                      src={auction.media_url} 
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg border bg-muted flex items-center justify-center mb-6">
                    <div className="text-center">
                      <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  </div>
                )}

                {/* Promotional Tags */}
                {auction.promotional_tags && auction.promotional_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {auction.promotional_tags.filter(tag => tag.trim()).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auction Details Tabs */}
            <Card className="shadow-lg border-0">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="bids">Bid History ({bidHistory.length})</TabsTrigger>
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
                        <Plus className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Bid Increment</p>
                          <p className="text-xl font-bold">${auction.bid_increment.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Plus className="h-5 w-5 text-primary" />
                        <div >
                          <p className="text-sm font-medium text-muted-foreground">Current Highest Bidder</p>
                          <div className="flex gap-3 mt-1">
                            <p className="text-lg font-bold">{bidData.highest_bid?.identity || "Unknown"}</p> -
                           <p>{bidData.highest_bid?.amount ? `$${bidData.highest_bid.amount.toLocaleString()}` : "No Bids"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                          <p className="font-medium">
                            {new Date(auction.auction_start_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Timer className="h-5 w-5 text-primary" />
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

                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Active Bidders</p>
                          <p className="font-medium">NO: {bidData.total_active_bidders || 0}</p>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="bids" className="p-6">
                  <div className="space-y-4">
                    {bidHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Bidder</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bidHistory.map((bid) => (
                              <TableRow key={bid.id}>
                                <TableCell className="font-medium">{bid.bidder}</TableCell>
                                <TableCell className="font-bold text-primary">
                                  ${bid.bid_amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(bid.time).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={bid.isAutoBid ? "secondary" : "outline"} className="text-xs">
                                    {bid.isAutoBid ? "Auto" : "Manual"}
                                  </Badge>
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
                          Be the first to place a bid on this auction
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Bidding Panel */}
          <div className="space-y-6">
            {/* Current Bid Status */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
                  <p className="text-3xl font-bold text-primary">
                    ${currentBid.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bidHistory.length} bid{bidHistory.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                  <div className="space-y-2">
      <p>
        Auction starts in:{" "}
        {startHours <= 0 ? "Already started" : `${Math.floor(startHours)} hours`}
      </p>
      <p>
        Auction ends in:{" "}
        {endHours <= 0 ? "Already ended" : `${Math.floor(endHours)} hours`}
      </p>
    </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Watchers</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{bidData.total_active_bidders || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Panel */}
            {isAuctionActive && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    Place Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bidAmount">Bid Amount</Label>
                    <div className="flex gap-2">
              <input
  type="number"
  min={auction.current_bid || auction.starting_bid}
  value={bid_amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  className="border rounded px-3 py-2 w-full text-black"
  placeholder="Enter your bid amount"
/>

                      <Button
                        variant="outline"
                        onClick={handleIncrementBid}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        ${auction.bid_increment}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: ${minNextBid.toLocaleString()}
                    </p>
                  </div>

                  <Button 
                    onClick={handlePlaceBid}
                    disabled={bidLoading || bid_amount < minNextBid}
                    className="w-full"
                    size="lg"
                  >
                    {bidLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        Place Bid ${bid_amount.toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

      <div className="mb-4">
  <input
    type="checkbox"
    id="autoBidToggle"
    checked={showAutoBidPanel}
    onChange={() => setShowAutoBidPanel((prev) => !prev)}
    className="mr-2"
  />
  <label htmlFor="autoBidToggle" className="text-sm font-medium">
    Enable Auto-Bid
  </label>
</div>

            {/* Auto-Bid Panel */}
            {showAutoBidPanel && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Auto-Bid
                  </CardTitle>
                  <CardDescription>
                    Set a maximum bid and let the system bid for you automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {autoBidEnabled ? (
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-medium text-primary">Auto-Bid Active</p>
                      <p className="text-sm text-muted-foreground">
                        Maximum: ${maxAutoBid.toLocaleString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoBidEnabled(false)}
                        className="mt-2"
                      >
                        Disable Auto-Bid
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="maxAutoBid">Maximum Auto-Bid Amount</Label>
                        <Input
                          id="maxAutoBid"
                          type="number"
                          value={maxAutoBid}
                          onChange={(e) => setMaxAutoBid(Number(e.target.value))}
                          min={currentBid + auction.bid_increment}
                          step={auction.bid_increment}
                          placeholder="Enter maximum bid_amount"
                        />
                        <p className="text-xs text-muted-foreground">
                          The system will automatically bid up to this bid_amount
                        </p>
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="maxAutoBid">Maximum Auto-Bid Amount</Label>
                        <Input
                          id="maxAutoBid"
                          type="number"
                          value={maxAutoBid}
                          onChange={(e) => setMaxAutoBid(Number(e.target.value))}
                          min={currentBid + auction.bid_increment}
                          step={auction.bid_increment}
                          placeholder="Enter maximum bid_amount"
                        />
                        <p className="text-xs text-muted-foreground">
                          The system will automatically bid up to this bid_amount
                        </p>
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="maxAutoBid" className="text-sm font-medium">
                          Max Bid Limit
                        </Label>
                        <Input
                          id="maxAutoBid"
                          type="number"
                          value={maxAutoBid || ''}
                          onChange={(e) => setMaxAutoBid(Number(e.target.value))}
                          min={currentBid + auction.bid_increment}
                          step={auction.bid_increment}
                          placeholder="e.g. 20,000"
                          className="text-lg"
                        />
                        <p className="text-xs text-muted-foreground">
                          The total bid_amount you're willing to spend on this auction.
                        </p>
                      </div>

                      {/* Bid Step Amount */}
                      <div className="space-y-2">
                        <Label htmlFor="bidStepAmount" className="text-sm font-medium">
                          Bid Step Amount
                        </Label>
                        <Input
                          id="bidStepAmount"
                          type="number"
                          value={'bidStepAmount' in window ? bidStepAmount : auction.bid_increment}
                          onChange={(e) => setMaxAutoBid(Number(e.target.value))}
                          min={auction.bid_increment}
                          step={auction.bid_increment}
                          placeholder="e.g. 500"
                          className="text-lg"
                        />
                        <p className="text-xs text-muted-foreground">
                          The bid_amount the system will automatically bid on your behalf when you're outbid.
                        </p>
                      </div>

                      <Button 
                        onClick={handleSetupAutoBid}
                        disabled={maxAutoBid <= currentBid}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        Setup Auto-Bid
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Auction Ended */}
            {!isAuctionActive && (
              <Card className="shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Auction {auctionStatus === 'ended' ? 'Ended' : 'Not Active'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {auctionStatus === 'ended' 
                        ? 'This auction has ended. No more bids can be placed.'
                        : 'This auction is not currently active.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
