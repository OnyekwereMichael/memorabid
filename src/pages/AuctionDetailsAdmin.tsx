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
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, Auction, auctionAPI, Bidder, BiddersResponse } from "@/lib/api";
import { getCookie } from "@/lib/utils";

// Add API_BASE_URL for debugging
const API_BASE_URL = 'https://affliate.rosymaxpharmacy.com/api';
import { log } from "node:console";
import { useAuctionStatus } from "./ActiveAuction";
import AuctionTimer from "./AuctionTimer";
// @ts-ignore
import confetti from 'canvas-confetti';
import AuctionTimeline from "./AuctionTimeline";

interface Bid {
  id: number;
  bidder: string;
  bid_amount: number;
  time: string;
  isAutoBid?: boolean;
}

const AuctionDetailsAdmins = () => {
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
  const [declaringWinner, setDeclaringWinner] = useState<number | null>(null);
  const [biddersData, setBiddersData] = useState<BiddersResponse | null>(null);
  const [biddersLoading, setBiddersLoading] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const getHoursRemaining = (targetTime: string) => {
        const now = new Date();
        const target = new Date(targetTime);
        return (target.getTime() - now.getTime()) / (1000 * 60 * 60);
      };

      if (auction?.auction_start_time) {
        setStartHours(getHoursRemaining(auction.auction_start_time));
      }
      if (auction?.auction_end_time) {
        setEndHours(getHoursRemaining(auction.auction_end_time));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => clearInterval(interval);
  }, [auction]);






  
 
  // Function to fetch auction details from API
  const fetchAuctionDetails = async () => {
    const token = getCookie('token');
    if (!token || !id) return;
    
    setLoading(true);
    try {
      const result = await auctionAPI.fetchAuctionById_Admin(Number(id), token);
      if (result && result.data) {
        // Handle both possible response structures
        const apiAuction = (result.data as any).auction || result.data;
        // Parse promotional_tags if it's a stringified array
        let tags: string[] = [];
        try {
          tags = apiAuction.promotional_tags
            ? (typeof apiAuction.promotional_tags === 'string' 
                ? JSON.parse(apiAuction.promotional_tags) 
                : apiAuction.promotional_tags)
            : [];
        } catch {
          tags = [];
        }
                     // Debug logging
         

           const auctionObject = {
            id: apiAuction.id,
            title: apiAuction.title,
            description: apiAuction.description,
            starting_bid: Number(apiAuction.starting_bid),
            reserve_price: Number(apiAuction.reserve_price),
            bid_increment: isNaN(Number(apiAuction.bid_increment)) ? 100 : Number(apiAuction.bid_increment),
            auction_start_time: apiAuction.auction_start_time,
            auction_end_time: apiAuction.auction_end_time,
             media: apiAuction.media || [], // Include the media array
            media_url: apiAuction.media_url || "",
            watchers: apiAuction.watchers || 0,
            promotional_tags: tags,
            auto_extend: apiAuction.auto_extend,
            featured: apiAuction.featured,
            status: apiAuction.status,
            current_bid: apiAuction.highest_bid ? Number(apiAuction.highest_bid) : Number(apiAuction.starting_bid),
            user: (apiAuction as any).creator
              ? {
                  id: (apiAuction as any).creator.id,
                  name: (apiAuction as any).creator.name,
                  email: (apiAuction as any).creator.email,
                  role: (apiAuction as any).creator.role || "seller",
                }
              : { id: 0, name: "Unknown", email: "", role: "seller" },
           } as Auction;

           console.log("Setting auction object:", auctionObject);
           console.log("Auction media in object:", auctionObject.media);
           console.log("First media in object:", auctionObject.media?.[0]);

           setAuction(auctionObject);

          // Set bid data with highest bid information
          if (result.data.highest_bid && result.data.highest_bidder) {
            setBidData({
              ...bidData,
              highest_bid: {
                amount: Number(result.data.highest_bid),
                identity: result.data.highest_bidder.name
              },
              total_active_bidders: result.data.total_active_bidders || 0
            });
          }

          // Set bid history if available
          if ((apiAuction as any).bids && Array.isArray((apiAuction as any).bids)) {
            setBidHistory(
              (apiAuction as any).bids.map((b: any, idx: number) => ({
                id: b.id || idx,
                bidder: b.bidder?.name || b.bidder_name || "Bidder",
                bid_amount: Number(b.amount || b.bid_amount),
                time: b.created_at || new Date().toISOString(),
                isAutoBid: b.is_auto === "1" || b.is_auto_bid || false,
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

  // Call fetchAuctionDetails when component mounts or id changes
  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  // console.log("Fetched auction result:", result);


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



const isAuctionActive = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const now = new Date(); // current local time
  const start = new Date(startTime); // from backend (ISO format)
  const end = new Date(endTime);     // from backend

  return now >= start && now <= end;
};

const active = isAuctionActive(auction?.auction_start_time, auction?.auction_end_time);
console.log('Auction Active:', active);

const [errorStates, setErrorStates] = useState({});

const getInitials = (fullName) =>
  fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const handleImageError = (index) => {
  setErrorStates((prev) => ({ ...prev, [index]: true }));
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

 const handleIncrementBid = () => {
  if (!auction) return;
  const currentBid = bidData.highest_bid?.amount || auction.current_bid || auction.starting_bid;
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

    const currentBid = bidData.highest_bid?.amount || auction.current_bid || auction.starting_bid;
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

        // Update UI with new bid
        const newBid: Bid = {
          id: bidHistory.length + 1,
          bidder: "You",
          bid_amount: bid_amount,
          time: new Date().toISOString(),
        };
        setBidHistory([newBid, ...bidHistory]);
        
        // Update auction and bid data
        setAuction({ ...auction, current_bid: bid_amount });
        setBidData({
          ...bidData,
          highest_bid: {
            amount: bid_amount,
            identity: "You"
          }
        });
        
        // Refresh auction data from API to ensure everything is up to date
        fetchAuctionDetails();

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

  // const handleSetupAutoBid = async () => {
  //   if (!auction || maxAutoBid <= 0) return;
    
  //   const currentBid = bidData.highest_bid?.amount || auction.current_bid || auction.starting_bid;
    
  //   if (maxAutoBid <= currentBid) {
  //     toast({
  //       title: "Invalid Auto-Bid",
  //       description: `Auto-bid maximum must be higher than current bid of $${currentBid.toLocaleString()}`,
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 500));
      
  //     setAutoBidEnabled(true);
  //     toast({
  //       title: "Auto-Bid Activated!",
  //       description: `Auto-bid set up to $${maxAutoBid.toLocaleString()}`,
  //     });
      
  //   } catch (error) {
  //     toast({
  //       title: "Auto-Bid Setup Failed",
  //       description: "Failed to set up auto-bid. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };



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

  const handleDeclareWinner = async (bidderId: number) => {
    setDeclaringWinner(bidderId);
    
    try {
      const token = getCookie('token');
      if (!token || !id) {
        toast({
          title: "Authentication Error",
          description: "Please log in to declare a winner.",
          variant: "destructive",
        });
        return;
      }

      // Find the bidder to get the user_id
      const winner = biddersData?.bidders.find(bidder => bidder?.bidder_id === bidderId);
      
      if (!winner) {
        toast({
          title: "Error",
          description: "Bidder not found.",
          variant: "destructive",
        });
        return;
      }

             // Call the API to declare winner
       console.log('Declaring winner with data:', {
         auctionId: Number(id),
         userId: winner?.user_id,
         winnerName: winner.name,
         winnerEmail: winner.email,
         bidderId: bidderId
       });
       
       // Validate user_id exists
       if (!winner?.user_id) {
         toast({
           title: "Error",
           description: "Invalid user ID. Cannot declare winner.",
           variant: "destructive",
         });
         return;
       }
      
             console.log('Sending request to backend:', {
         url: `${API_BASE_URL}/auction/admin/set/${Number(id)}/winner`,
         method: 'POST',
         body: { 
           user_id: winner.user_id,
           bidder_id: bidderId 
         },
         headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${token}`
         }
       });
       
       // Call the API with both user_id and bidder_id
       const response = await fetch(`${API_BASE_URL}/auction/admin/set/${Number(id)}/winner`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ 
           user_id: winner.user_id,
           bidder_id: bidderId 
         })
       });
       
       const result = await response.json();
      
             if (response.ok && result.status === "success") {
         // Trigger confetti with more celebration
         confetti({
           particleCount: 150,
           spread: 90,
           origin: { y: 0.6 },
           colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
           shapes: ['circle', 'square'],
           gravity: 0.8,
           ticks: 200
         });
         
         // Get winner details from the response
         const winnerData = result.data;
         
         toast({
           title: "🏆 Winner Successfully Declared!",
           description: `${winnerData.winner_name} (${winnerData.winner_email}) has been officially declared the winner of Auction #${winnerData.auction_id}. The auction has been successfully concluded.`,
         });
         
         // Log the complete winner details
         console.log('Winner declared successfully:', {
           auctionId: winnerData.auction_id,
           winnerId: winnerData.winner_id,
           winnerName: winnerData.winner_name,
           winnerEmail: winnerData.winner_email,
           winnerType: winnerData.winner_type
         });
         
         // Optionally refresh the bidders data to show updated status
         // You could add a winner status to the bidders data if needed
         
       } else {
         console.error('Backend error response:', result);
         toast({
           title: "Failed to Declare Winner",
           description: result.message || result.errors?.join(', ') || "Failed to declare winner. Please try again.",
           variant: "destructive",
         });
       }
    } catch (error) {
      console.error('Error declaring winner:', error);
      toast({
        title: "Error",
        description: "Failed to declare winner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeclaringWinner(null);
    }
  };



useEffect(() => {
  const getBids = async () => {
    const token = getCookie('token');
    if (!token || !id) return;

    try {
      const result = await auctionAPI.fetchBidsByAuctionId(Number(id), token); // pass token
      console.log("Fetched bids:", result);
      setBidData(result.data || {});
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  getBids();
}, [id]);

// Fetch bidders data
useEffect(() => {
  const fetchBidders = async () => {
    const token = getCookie('token');
    if (!token || !id) return;

    setBiddersLoading(true);
    try {
      const result = await adminAPI.fetchAuctionById_bidders(Number(id), token);
      if (result.success && result.data) {
        setBiddersData(result.data);
      } else {
        console.error('Failed to fetch bidders:', result.message);
        toast({
          title: "Error",
          description: "Failed to load bidders data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching bidders:', error);
      toast({
        title: "Error",
        description: "Failed to load bidders data.",
        variant: "destructive",
      });
    } finally {
      setBiddersLoading(false);
    }
  };

  fetchBidders();
}, [id, toast]);

console.log("Bid Data:", bidData);
console.log("Auction media:", auction);
// console.log("First media URL:", auction.media?.[0]?.media_url);

// Remove the duplicate getAuctionDetails function - we already have one above


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
          <Button onClick={() => navigate("/admin-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentBid = bidData.highest_bid?.amount || auction.current_bid || auction.starting_bid;
  const minNextBid = currentBid + auction.bid_increment;
  const auctionStatus = auction.status || getAuctionStatus(auction);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin-dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
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

      <div className=" mx-auto p-4 sm:p-6 space-y-6">
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
                 {(() => {
                   console.log("Rendering media section - auction:", auction);
                   console.log("Rendering media section - auction.media:", auction.media);
                   console.log("Rendering media section - auction.media.length:", auction.media?.length);
                   console.log("Rendering media section - first media item:", auction.media?.[0]);
                   console.log("Rendering media section - media_url:", auction.media?.[0]?.media_url);
                   
                   return auction.media && auction.media.length > 0 ? (
  <div className="aspect-video w-full rounded-lg overflow-hidden border mb-6">
    <img 
      src={auction.media[0].media_url}
      alt={auction.title}
      className="w-full h-full object-cover"
                         onError={(e) => {
                           console.error("Image failed to load:", e);
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
                   );
                 })()}

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

            {/* Auction Details Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Auction Details</CardTitle>
              </CardHeader>
              <CardContent>
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
                          <p className="text-lg font-bold">Bidder{auction.id || "Unknown"}</p> -
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
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                  <AuctionTimeline
  auctionStart={auction.auction_start_time}
  auctionEnd={auction.auction_end_time}
/>

              </CardContent>
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
    {/* <AuctionTimer auction={auction} /> */}
 <AuctionTimer auction={auction} />

    </div>
                </div>

                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Watchers</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{bidData.total_active_bidders || 0}</span>
                  </div>
                </div>

                 <Separator />
                 
                 <div class="flex gap-3 flex-col">
  <button className="bg-purple-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
    Exit
  </button>
  <button className="bg-purple-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
    Extend
  </button>
  <button className="bg-purple-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
    Cancel
  </button>
</div>

              </CardContent>
            </Card>

                  

            {/* Bidding Panel */}
            
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
            
            {/* Bid History */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Bid History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                              <TableCell className="font-medium">Bidder{bid.id}</TableCell>
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

                 {/* Bidders List Card */}
         <Card className="shadow-lg border-0">
           <CardHeader>
                           <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Auction Bidders ({biddersData?.total_bidders || 0})
              </CardTitle>
             <CardDescription>
               All participants who have placed bids on this auction
             </CardDescription>
           </CardHeader>
           <CardContent>
             {biddersLoading ? (
               <div className="flex items-center justify-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                 <span className="ml-2 text-muted-foreground">Loading bidders...</span>
               </div>
                           ) : biddersData?.bidders && biddersData.bidders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {biddersData.bidders.map((bidder) => (
                                 <Card key={bidder.bidder_id} className="border border-border/50 hover:border-primary/50 transition-colors">
                   <CardContent className="p-4">
                     <div className="flex items-start gap-3">
                       {/* Avatar */}
                       <div className="relative">
                       <div className="flex gap-4 flex-wrap">
                       <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(bidder.name)}
                  </div>
                          </div>
                         {/* <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         </div> */}
                       </div>

                       {/* Bidder Info */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                           <h4 className="font-semibold text-sm truncate">{bidder.name}</h4>
                           <Badge variant="default" className="text-xs">
                             {bidder.bidder_type}
                           </Badge>
                         </div>
                         
                         <p className="text-xs text-muted-foreground mb-2">{bidder.email}</p>
                         
                         <div className="space-y-1">
                           <div className="flex justify-between text-xs">
                             <span className="text-muted-foreground">Highest Bid:</span>
                             <span className="font-semibold text-primary">${Number(bidder.highest_bid_by_bidder).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                             <span className="text-muted-foreground">Total Bids:</span>
                             <span className="font-medium">{bidder.total_bids}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                             <span className="text-muted-foreground">User ID:</span>
                             <span className="font-medium">{bidder.user_id}</span>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Declare Winner Button */}
                     <div className="mt-4 pt-3 border-t border-border/50">
                       <Button
                         onClick={() => handleDeclareWinner(bidder.bidder_id)}
                         disabled={declaringWinner === bidder.bidder_id}
                         className="w-full"
                         variant="outline"
                         size="sm"
                       >
                                                  {declaringWinner === bidder.bidder_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Declaring Winner...
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Declare Winner
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-1">No bidders yet</h3>
              <p className="text-sm text-muted-foreground">
                No one has placed bids on this auction yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default AuctionDetailsAdmins;

