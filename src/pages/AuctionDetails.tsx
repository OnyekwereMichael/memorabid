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
  AlertCircle,
  History,
  Link,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, Auction, auctionAPI } from "@/lib/api";
import { getCookie, getTimeLeft } from "@/lib/utils";
import { log } from "node:console";
import { useAuctionStatus } from "./ActiveAuction";
import AuctionTimer from "./AuctionTimer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  const [auctions, setAuctions] = useState<any[]>([]); 
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
  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());

  
  useEffect(() => {
    const getAuction = async () => {
      const token = getCookie('token');
      if (!token) return;

      try {
        const result = await auctionAPI.fetchAuctions(token);
        setAuctions(result.data || []);
        setLoading(false);
        console.log("Fetched result:", result);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching bids:", error);
      }
    };

    getAuction();
  }, []);

  const getCurrentBid = (item: any) => {
    const auction = getAuctionObj(item);
    if (item.highest_bid) return Number(item.highest_bid);
    if (auction.current_bid) return Number(auction.current_bid);
    if (auction.starting_bid) return Number(auction.starting_bid);
    if (auction.highest_bid) return Number(auction.highest_bid);
    return 0;
  };

  const getWatchers = (item: any) => {
    const auction = getAuctionObj(item);
    return auction.watchers || 0;
  };

  useEffect(() => {
    if (!auction) return;
    
    const updateCountdown = () => {
      const getHoursRemaining = (targetTime: string) => {
        if (!targetTime) return 0;
        const now = new Date();
        const target = new Date(targetTime);
        return (target.getTime() - now.getTime()) / (1000 * 60 * 60);
      };

      setStartHours(getHoursRemaining(auction.auction_start_time));
      setEndHours(getHoursRemaining(auction.auction_end_time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => clearInterval(interval);
  }, [auction?.auction_start_time, auction?.auction_end_time]);

  // Fetch auction details from API
  useEffect(() => {
    const getAuctionDetails = async () => {
      const token = getCookie('token');
      if (!token || !id) return;

      try {
        const result = await auctionAPI.fetchAuctionById(Number(id), token);
        if (result && result.data) {
          const apiAuction = result.data;
          // Parse promotional_tags if it's a stringified array
          let tags: string[] = [];
          try {
            tags = apiAuction.promotional_tags
              ? JSON.parse(apiAuction.promotional_tags)
              : [];
          } catch {
            tags = [];
          }

          const auctionObject = {
            id: apiAuction.id,
            title: apiAuction.title,
            description: apiAuction.description,
            starting_bid: Number(apiAuction.starting_bid),
            reserve_price: Number(apiAuction.reserve_price),
            bid_increment: isNaN(Number(apiAuction.bid_increment)) ? 100 : Number(apiAuction.bid_increment),
            auction_start_time: apiAuction.auction_start_time,
            auction_end_time: apiAuction.auction_end_time,
            media: apiAuction.media || [],
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
          } as Auction;

          setAuction(auctionObject);

          // Set bid history if available
          if (apiAuction.bids && Array.isArray(apiAuction.bids)) {
            setBidHistory(
              apiAuction.bids.map((b: any, idx: number) => ({
                id: b.id || idx,
                bidder: b.bidder?.name || "Bidder",
                bid_amount: Number(b.amount),
                time: b.created_at || new Date().toISOString(),
                isAutoBid: b.is_auto === "1" || false,
              }))
            );
            
            if (result.data.highest_bid) {
              setBidData({
                highest_bid: {
                  amount: Number(result.data.highest_bid),
                  identity: bidData.highest_bid?.identity || 'None'
                },
                total_bids: apiAuction.bids?.length || 0,
                total_active_bidders: bidData.total_active_bidders || 0
              });
            }
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
    if (!auction?.auction_end_time) return;

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
  }, [auction?.auction_end_time]);

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

  const isAuctionActive = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return false;
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const isActive = now >= start && now <= end;
    
    return isActive;
  };

  const active = isAuctionActive(
    auction?.auction_start_time || "",
    auction?.auction_end_time || ""
  );

  const getAuctionObj = (item: any) => {
    if (item?.title || item?.auction_start_time || item?.auction_end_time) {
      return item;
    }
    return item?.auction || {};
  };

  const getAuctionStatuss = (item: any) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    const endTime = new Date(auction.auction_end_time);

    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    if (endTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'ending_soon';
    return 'active';
  };

  const stat = getAuctionStatuss(auction);

  const getAuctionStatus = (auction: Auction) => {
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    const endTime = new Date(auction.auction_end_time);
    
    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    
    if (endTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'ending_soon';
    return 'active';
  };

  const handleIncrementBid = () => {
    if (!auction) return;
    const currentBid = auction.current_bid || auction.starting_bid;
    const nextBid = Math.max(bid_amount + auction.bid_increment, currentBid + auction.bid_increment);
    setAmount(nextBid);
  };

  // Function to refresh auction and bid data
  const refreshAuctionAndBids = async () => {
    if (!id) return;
    const token = getCookie('token');
    if (!token) return;

    try {
      const auctionResult = await auctionAPI.fetchAuctionById(Number(id), token);
      if (auctionResult && auctionResult.data) {
        const apiAuction = auctionResult.data;
        let tags: string[] = [];
        try {
          tags = apiAuction.promotional_tags
            ? JSON.parse(apiAuction.promotional_tags)
            : [];
        } catch {
          tags = [];
        }

        const auctionObject = {
          id: apiAuction.id,
          title: apiAuction.title,
          description: apiAuction.description,
          starting_bid: Number(apiAuction.starting_bid),
          reserve_price: Number(apiAuction.reserve_price),
          bid_increment: isNaN(Number(apiAuction.bid_increment)) ? 100 : Number(apiAuction.bid_increment),
          auction_start_time: apiAuction.auction_start_time,
          auction_end_time: apiAuction.auction_end_time,
          media: apiAuction.media || [],
          media_url: apiAuction.media_url || "",
          watchers: apiAuction.watchers || 0,
          promotional_tags: tags,
          auto_extend: apiAuction.auto_extend,
          featured: apiAuction.featured,
          status: apiAuction.status,
          current_bid: auctionResult.data.highest_bid ? Number(auctionResult.data.highest_bid) : Number(apiAuction.starting_bid),
          user: apiAuction.creator
            ? {
                id: apiAuction.creator.id,
                name: apiAuction.creator.name,
                email: apiAuction.creator.email,
                role: apiAuction.creator.role || "seller",
              }
            : { id: 0, name: "Unknown", email: "", role: "seller" },
        } as Auction;

        setAuction(auctionObject);

        if (apiAuction.bids && Array.isArray(apiAuction.bids)) {
          setBidHistory(
            apiAuction.bids.map((b: any, idx: number) => ({
              id: b.id || idx,
              bidder: b.bidder?.name || "Bidder",
              bid_amount: Number(b.amount),
              time: b.created_at || new Date().toISOString(),
              isAutoBid: b.is_auto === "1" || false,
            }))
          );
          
          if (auctionResult.data.highest_bid) {
            setBidData({
              highest_bid: {
                amount: Number(auctionResult.data.highest_bid),
                identity: bidData.highest_bid?.identity || 'None'
              },
              total_bids: apiAuction.bids?.length || 0,
              total_active_bidders: bidData.total_active_bidders || 0
            });
          }
        }
      }

      const bidsResult = await auctionAPI.fetchBidsByAuctionId(Number(id), token);
      if (bidsResult && bidsResult.data) {
        setBidData(bidsResult.data || {});
      }
    } catch (error) {
      console.error("Error refreshing auction data:", error);
    }
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

        await refreshAuctionAndBids();

        const { emitAuctionEvent, AUCTION_EVENTS } = await import("@/lib/utils");
        emitAuctionEvent(AUCTION_EVENTS.BID_PLACED, { 
          auction_id: auction.id,
          bid_amount: bid_amount
        });
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
        const result = await auctionAPI.fetchBidsByAuctionId(Number(id), token);
        setBidData(result.data || {});
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    getBids();
    
    let handleBidPlaced: ((event: Event) => void) | null = null;
    let cleanupEventListeners: (() => void) | null = null;
    
    import("@/lib/utils").then(({ AUCTION_EVENTS }) => {
      handleBidPlaced = (event: any) => {
        const customEvent = event as CustomEvent;
        const eventData = customEvent.detail;
        
        if (eventData && eventData.auction_id === Number(id)) {
          refreshAuctionAndBids();
        }
      };
      
      window.addEventListener(AUCTION_EVENTS.BID_PLACED, handleBidPlaced);
      
      cleanupEventListeners = () => {
        if (handleBidPlaced) {
          window.removeEventListener(AUCTION_EVENTS.BID_PLACED, handleBidPlaced);
        }
      };
    });
    
    const intervalId = setInterval(() => {
      refreshAuctionAndBids();
    }, 15000);
    
    return () => {
      clearInterval(intervalId);
      if (cleanupEventListeners) {
        cleanupEventListeners();
      }
    };
  }, [id]);

  const handleWatchlist = async () => {
    const token = getCookie('token');
    if (!token || !id) return;

    try {
      // Note: watchlist functionality would need to be implemented in the API
      toast({
        title: "Added to Watchlist", 
        description: "You will receive updates about this auction.",
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/auction/${Number(id)}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Auction link has been copied to clipboard.",
      });
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  // Check if bidding should be disabled based on auction start time
  const isBiddingDisabled = () => {
    if (!auction) return true;
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    return now < startTime;
  };

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
              <span className="hidden sm:inline">Back to Auctions</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleWatch}
              className="gap-2 px-2 sm:px-3"
            >
              <Heart className={`h-4 w-4 ${isWatching ? 'fill-current text-red-500' : ''}`} />
              <span className="hidden sm:inline">{isWatching ? 'Watching' : 'Watch'}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 px-2 sm:px-3" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Header */}
            <Card className="shadow-lg border-0">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <CardTitle className="text-xl sm:text-2xl lg:text-3xl">{auction.title}</CardTitle>
                      <Badge variant={getStatusVariant(auctionStatus) as any} className="text-sm self-start">
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
              <CardContent className="p-4 sm:p-6 pt-0">
                {/* Product Image */}
                {auction && (
                  <>
                    {auction.media && auction.media.length > 0 ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border mb-6">
                        <img 
                          src={auction.media[0].media_url}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("AuctionDetails - Image failed to load:", e);
                            e.currentTarget.style.display = 'none';
                          }}
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
                  </>
                )}

                {/* Promotional Tags */}
                {auction && auction.promotional_tags && auction.promotional_tags.length > 0 && (
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
                <TabsList className="border-b px-4 sm:px-6 pt-2 w-full justify-start">
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="p-4 sm:p-6">
                  <p className="text-xl sm:text-2xl font-semibold mb-4">Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Starting Bid</p>
                          <p className="text-lg sm:text-xl font-bold">${auction.starting_bid.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Reserve Price</p>
                          <p className="text-lg sm:text-xl font-bold">${auction.reserve_price?.toLocaleString() || "Not Set"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Plus className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Bid Increment</p>
                          <p className="text-lg sm:text-xl font-bold">${auction.bid_increment.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div className="flex gap-1 items-center">
                          <p className="text-md font-bold">Highest Bidder:</p>
                          <p className="text-lg font-bold">{bidData.highest_bid?.amount ? `$${bidData.highest_bid.amount.toLocaleString()}` : "No Bids"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                          <p className="font-medium text-sm sm:text-base">
                            {new Date(auction.auction_start_time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Timer className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">End Time</p>
                          <p className="font-medium text-sm sm:text-base">
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
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Active Bidders</p>
                          <p className="font-medium">{bidData.total_active_bidders || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Sidebar - Bidding Panel */}
          <div className="space-y-6">
            {/* Current Bid Status */}
            <Card className="shadow-lg border-0">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current Highest Bid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    ${bidData.highest_bid?.amount ? bidData.highest_bid.amount.toLocaleString() : currentBid.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bidHistory.length} bid{bidHistory.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                  <div className="space-y-2">
                    <AuctionTimer auction={auction} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Active Bidders</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{bidData.total_active_bidders || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bidding Panel */}
            {(stat === 'active' || stat === 'ending_soon') && (
              <Card className="shadow-lg border-0">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    Place Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
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
                        disabled={isBiddingDisabled()}
                      />
                      <Button
                        variant="outline"
                        onClick={handleIncrementBid}
                        className="gap-1 whitespace-nowrap"
                        disabled={isBiddingDisabled()}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">${auction.bid_increment}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: ${minNextBid.toLocaleString()}
                    </p>
                  </div>

                  <Button 
                    onClick={handlePlaceBid}
                    disabled={bidLoading || bid_amount < minNextBid || isBiddingDisabled()}
                    className="w-full"
                    size="lg"
                  >
                    {isBiddingDisabled() ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Bidding Starts Soon
                      </>
                    ) : bidLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Bid...
                      </>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Place Bid ${bid_amount.toLocaleString()}</span>
                        <span className="sm:hidden">${bid_amount.toLocaleString()}</span>
                      </>
                    )}
                  </Button>

                  {isBiddingDisabled() && (
                    <p className="text-xs text-muted-foreground text-center">
                      Bidding will be available when the auction starts
                    </p>
                  )}

                  <Button 
                    onClick={() => setShowAutoBidPanel((prev) => !prev)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={isBiddingDisabled()}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Auto Bid ${bid_amount.toLocaleString()}</span>
                    <span className="sm:hidden">Auto Bid</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Upcoming bid message */}
            {stat === 'upcoming' && (
              <Card className="shadow-lg border-0">
                <CardContent className="pt-6 p-4 sm:p-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Auction Not Started</h3>
                    <p className="text-sm text-muted-foreground">
                      This auction has not started yet. Please check back later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Auto-Bid Panel */}
            {showAutoBidPanel && !isBiddingDisabled() && (
              <Card className="shadow-lg border-0">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Auto-Bid
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Set a maximum bid and let the system bid for you automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
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
                          The total amount you're willing to spend on this auction.
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
            {stat === 'ended' && (
              <Card className="shadow-lg border-0">
                <CardContent className="pt-6 p-4 sm:p-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Auction Ended</h3>
                    <p className="text-sm text-muted-foreground">
                      This auction has ended. No more bids can be placed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bid History */}
            <Card className="shadow-lg border-0">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Bid History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {bidHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Bidder</TableHead>
                            <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                            <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Time</TableHead>
                            <TableHead className="text-xs sm:text-sm">Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bidHistory.map((bid) => (
                            <TableRow key={bid.id}>
                              <TableCell className="font-medium text-xs sm:text-sm">
                                Bidder {bid.id}
                              </TableCell>
                              <TableCell className="font-bold text-primary text-xs sm:text-sm">
                                ${bid.bid_amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
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
                    <div className="text-center py-4">
                      <Gavel className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No bids yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to place a bid on this auction
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;