import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Clock, 
  Users, 
  Gavel, 
  DollarSign, 
  Eye, 
  Heart, 
  Filter,
  SortAsc,
  Timer,
  TrendingUp,
  Star,
  User
} from "lucide-react";
import { adminAPI, auctionAPI } from "@/lib/api";
import type { Auction } from "@/lib/api";
import { getCookie, getTimeLeft } from "@/lib/utils";
import { log } from "node:console";
import AuctionTimer from "./AuctionTimer";

const AuctionListing = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<any[]>([]); // Use any[] for now, or define a type for your API data
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ending_soon");
  const [filterBy, setFilterBy] = useState("all");
  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const getAuction = async () => {
      const token = getCookie('token');
      if (!token) return;

      try {
        const result = await auctionAPI.fetchAuctions(token);
        // result.data is an array of { auction, total_bids, ... }
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

  // Helper to get the auction object from the API response
  const getAuctionObj = (item: any) => item.auction || {};

  // Helper to get the current bid (use highest_bid or starting_bid)
  const getCurrentBid = (item: any) => {
    const auction = getAuctionObj(item);
    if (item.highest_bid) return Number(item.highest_bid);
    if (auction.current_bid) return Number(auction.current_bid);
    if (auction.starting_bid) return Number(auction.starting_bid);
    return 0;
  };

  // // Helper to get bid increment (handle "Auto" as fallback)
  // const getBidIncrement = (item: any) => {
  //   const auction = getAuctionObj(item);
  //   if (auction.bid_increment && auction.bid_increment !== "Auto") return Number(auction.bid_increment);
  //   return 100; // fallback increment
  // };

  // // Helper to get tags (parse JSON string)
  // const getTags = (item: any) => {
  //   const auction = getAuctionObj(item);
  //   try {
  //     return auction.promotional_tags ? JSON.parse(auction.promotional_tags) : [];
  //   } catch {
  //     return [];
  //   }
  // };

  // Helper to get seller name
  const getSeller = (item: any) => {
    const auction = getAuctionObj(item);
    return auction.creator?.name || "Unknown";
  };

  // Helper to get watchers (not in API, fallback to 0)
  const getWatchers = (item: any) => {
    const auction = getAuctionObj(item);
    return auction.watchers || 0;
  };

  // Helper to get auction status
  const getAuctionStatus = (item: any) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const startTime = new Date(auction.auction_start_time);
    const endTime = new Date(auction.auction_end_time);

    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    if (endTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'ending_soon';
    return 'active';
  };



  // Filtering and sorting logic (update to use API data structure)
  const filteredAndSortedAuctions = auctions
    .filter((item) => {
      const auction = getAuctionObj(item);
      const matchesSearch =
        auction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSeller(item).toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterBy === "all") return true;
      if (filterBy === "featured") return auction.featured;
      if (filterBy === "ending_soon") return getAuctionStatus(item) === 'ending_soon';
      if (filterBy === "watched") return watchedItems.has(auction.id);

      return true;
    })
    .sort((a, b) => {
      const auctionA = getAuctionObj(a);
      const auctionB = getAuctionObj(b);
      switch (sortBy) {
        case "ending_soon":
          return new Date(auctionA.auction_end_time).getTime() - new Date(auctionB.auction_end_time).getTime();
        case "price_low":
          return getCurrentBid(a) - getCurrentBid(b);
        case "price_high":
          return getCurrentBid(b) - getCurrentBid(a);
        case "newest":
          return new Date(auctionB.auction_start_time).getTime() - new Date(auctionA.auction_start_time).getTime();
        case "most_watched":
          return getWatchers(b) - getWatchers(a);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Auctions</h1>
          <p className="text-muted-foreground text-lg">Discover and bid on amazing items from verified sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search auctions, sellers, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="most_watched">Most Watched</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auctions</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedAuctions.length} of {auctions.length} auctions
            </p>
            {watchedItems.size > 0 && (
              <p className="text-sm text-muted-foreground">
                {watchedItems.size} item{watchedItems.size !== 1 ? 's' : ''} in watchlist
              </p>
            )}
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredAndSortedAuctions.map((item) => {
            const auction = getAuctionObj(item);
            const currentBid = getCurrentBid(item);
            const bidCount = item.total_bids || 0;
            const timeLeft = getTimeLeft(item);
            const auctionStatus = auction.status || getAuctionStatus(item);
            const isWatched = watchedItems.has(auction.id);

            return (
              <Card key={auction.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  {/* Product Image */}
                  <Link to={`/auction-details/${auction.id}`}>
                    <CardHeader className="p-0">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                       {auction.media && auction.media.length > 0 ? (
  <img
    src={auction.media[0].media_url}
    alt={auction.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <Gavel className="h-12 w-12 text-muted-foreground" />
  </div>
)}

                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          {/* <Badge variant={getStatusVariant(auctionStatus) as any} className="text-xs">
                            {auctionStatus === 'ending_soon' ? 'Ending Soon' : 
                             auctionStatus === 'active' ? 'Live' : 
                             auctionStatus}
                          </Badge> */}
                        </div>

                        {/* Featured Badge */}
                        {auction.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {auction.status}
                            </Badge>
                          </div>
                        )}

                        {/* Watch Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          // onClick={(e) => {
                          //   e.preventDefault();
                          //   e.stopPropagation();
                          //   toggleWatch(auction.id);
                          // }}
                        >
                          <Heart className={`h-4 w-4 ${isWatched ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                        </Button>
                      </div>
                    </CardHeader>
                  </Link>
                  
                  {/* Card Content */}
                  <CardContent className="p-4">
                    <Link to={`/auction-details/${auction.id}`}>
                      <div className="space-y-3">
                        {/* Title and Seller */}
                        <div>
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {auction.title.toUpperCase()}
                          </CardTitle>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              by {getSeller(item)}
                            </p>
                          </div>
                          <CardDescription className="text-lg mt-3 text-muted-foreground line-clamp-2 mt-1">
                            {auction.description }
                          </CardDescription>
                        </div>

                        {/* Current Bid */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {bidCount > 0 ? 'Current Bid' : 'Starting Bid'}
                            </span>
                            <span className="font-bold text-xl text-primary">
                              ₦{currentBid.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Time and Bids Info */}
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              <span className={timeLeft === "Ended" ? "text-destructive" : ""}>
                                <AuctionTimer auction={auction} />

                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Gavel className="h-3 w-3" />
                                <span>{bidCount} bid{bidCount !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{getWatchers(item)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Bid Now Button */}
                        <Button 
                          className="w-full gap-2" 
                          disabled={auctionStatus === 'ended'}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/auction-details/${auction.id}`);
                          }}
                        >
                          {auctionStatus === 'ended' ? (
                            <>
                              <Clock className="h-4 w-4" />
                              Auction Ended
                            </>
                          ) : auctionStatus === 'upcoming' ? (
                            <>
                              <Clock className="h-4 w-4" />
                              Starts Soon
                            </>
                          ) : (
                            <>
                              <Gavel className="h-4 w-4" />
                              Bid Now
                            </>
                          )}
                        </Button>
                      </div>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAndSortedAuctions.length === 0 && (
          <div className="text-center py-12">
            <Gavel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 
                `No auctions match your search for "${searchQuery}"` : 
                "No auctions match your current filters"
              }
            </p>
            {(searchQuery || filterBy !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Load More (for future pagination) */}
        {filteredAndSortedAuctions.length > 0 && filteredAndSortedAuctions.length >= 12 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Auctions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionListing;
