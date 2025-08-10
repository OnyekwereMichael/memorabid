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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
      
      // First, sort by status priority: upcoming > active > ending_soon > ended
      const getStatusPriority = (status: string) => {
        switch (status) {
          case 'upcoming': return 0;
          case 'active': return 1;
          case 'ending_soon': return 2;
          case 'ended': return 3;
          default: return 4;
        }
      };
      
      const statusA = getAuctionStatus(a);
      const statusB = getAuctionStatus(b);
      const priorityA = getStatusPriority(statusA);
      const priorityB = getStatusPriority(statusB);
      
      // If statuses are different, sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If statuses are the same, apply the selected sort criteria
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
          // Default sorting: upcoming auctions by start time (earliest first)
          if (statusA === 'upcoming' && statusB === 'upcoming') {
            return new Date(auctionA.auction_start_time).getTime() - new Date(auctionB.auction_start_time).getTime();
          }
          // For other statuses, sort by end time (earliest first)
          return new Date(auctionA.auction_end_time).getTime() - new Date(auctionB.auction_end_time).getTime();
      }
  // Categorize by status for sections
  const liveAuctions = filteredAndSortedAuctions.filter((item) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const start = new Date(auction.auction_start_time);
    const end = new Date(auction.auction_end_time);
    return now >= start && now <= end;
  });
  const upcomingAuctions = filteredAndSortedAuctions.filter((item) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const start = new Date(auction.auction_start_time);
    return now < start;
  });
  const pastAuctions = filteredAndSortedAuctions.filter((item) => {
    const auction = getAuctionObj(item);
    const now = new Date();
    const end = new Date(auction.auction_end_time);
    return now > end;
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
        <div className="flex justify-between items-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Auctions</h1>
          <p className="text-muted-foreground text-lg">Discover and bid on amazing items from verified sellers</p>
        </div>

        <Button size="sm" asChild className="shadow-elegant">
            <Link to="/user-dashboard">Go to Dashboard</Link>
          </Button>
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

        {/* Live Auctions Slider */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Live Auctions</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gavel className="h-4 w-4" />
              <span>{liveAuctions.length} live</span>
            </div>
          </div>
          {liveAuctions.length > 0 ? (
            <div className="relative">
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent>
                  {liveAuctions.map((item) => {
                    const auction = getAuctionObj(item);
                    const currentBid = getCurrentBid(item);
                    const bidCount = item.total_bids || 0;
                    const timeLeft = getTimeLeft(item);
                    const auctionStatus = auction.status || getAuctionStatus(item);
                    const isWatched = watchedItems.has(auction.id);
                    return (
                      <CarouselItem key={auction.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden">
                          <div className="relative">
                            <Link to={`/auction-details/${auction.id}`}>
                              <CardHeader className="p-0">
                                <div className="aspect-square relative overflow-hidden bg-muted">
                                  {auction.media && auction.media.length > 0 ? (
                                    <img src={auction.media[0].media_url} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Gavel className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                  )}
                                  <Button variant="ghost" size="sm" className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white">
                                    <Heart className={`h-4 w-4 ${isWatched ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                                  </Button>
                                </div>
                              </CardHeader>
                            </Link>
                            <CardContent className="p-4">
                              <Link to={`/auction-details/${auction.id}`}>
                                <div className="space-y-3">
                                  <div>
                                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                      {auction.title.toUpperCase()}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 mt-1">
                                      <User className="h-3 w-3 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">by {getSeller(item)}</p>
                                    </div>
                                    <CardDescription className="text-lg mt-3 text-muted-foreground line-clamp-2 mt-1">
                                      {auction.description}
                                    </CardDescription>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">{bidCount > 0 ? 'Current Bid' : 'Starting Bid'}</span>
                                      <span className="font-bold text-xl text-primary">₦{currentBid.toLocaleString()}</span>
                                    </div>
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
                                  <Button className="w-full gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/auction-details/${auction.id}`); }}>
                                    <Gavel className="h-4 w-4" />
                                    Bid Now
                                  </Button>
                                </div>
                              </Link>
                            </CardContent>
                          </div>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <div className="text-muted-foreground">No live auctions right now.</div>
          )}
        </section>

        {/* Upcoming Auctions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Upcoming Auctions</h2>
          {upcomingAuctions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {upcomingAuctions.map((item) => {
                const auction = getAuctionObj(item);
                const currentBid = getCurrentBid(item);
                const bidCount = item.total_bids || 0;
                const timeLeft = getTimeLeft(item);
                const auctionStatus = auction.status || getAuctionStatus(item);
                const isWatched = watchedItems.has(auction.id);
                return (
                  <Card key={auction.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      <Link to={`/auction-details/${auction.id}`}>
                        <CardHeader className="p-0">
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            {auction.media && auction.media.length > 0 ? (
                              <img src={auction.media[0].media_url} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Gavel className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <Button variant="ghost" size="sm" className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <Heart className={`h-4 w-4 ${isWatched ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                            </Button>
                          </div>
                        </CardHeader>
                      </Link>
                      <CardContent className="p-4">
                        <Link to={`/auction-details/${auction.id}`}>
                          <div className="space-y-3">
                            <div>
                              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                {auction.title.toUpperCase()}
                              </CardTitle>
                              <div className="flex items-center gap-1 mt-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">by {getSeller(item)}</p>
                              </div>
                              <CardDescription className="text-lg mt-3 text-muted-foreground line-clamp-2 mt-1">
                                {auction.description}
                              </CardDescription>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{bidCount > 0 ? 'Current Bid' : 'Starting Bid'}</span>
                                <span className="font-bold text-xl text-primary">₦{currentBid.toLocaleString()}</span>
                              </div>
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
                            <Button className="w-full gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/auction-details/${auction.id}`); }}>
                              <Clock className="h-4 w-4" />
                              Starts Soon
                            </Button>
                          </div>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground">No upcoming auctions.</div>
          )}
        </section>

        {/* Past Auctions */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Past Auctions</h2>
          {pastAuctions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {pastAuctions.map((item) => {
                const auction = getAuctionObj(item);
                const currentBid = getCurrentBid(item);
                const bidCount = item.total_bids || 0;
                const auctionStatus = auction.status || getAuctionStatus(item);
                const isWatched = watchedItems.has(auction.id);
                return (
                  <Card key={auction.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      <Link to={`/auction-details/${auction.id}`}>
                        <CardHeader className="p-0">
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            {auction.media && auction.media.length > 0 ? (
                              <img src={auction.media[0].media_url} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Gavel className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <Button variant="ghost" size="sm" className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <Heart className={`h-4 w-4 ${isWatched ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                            </Button>
                          </div>
                        </CardHeader>
                      </Link>
                      <CardContent className="p-4">
                        <Link to={`/auction-details/${auction.id}`}>
                          <div className="space-y-3">
                            <div>
                              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                {auction.title.toUpperCase()}
                              </CardTitle>
                              <div className="flex items-center gap-1 mt-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">by {getSeller(item)}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Final Bid</span>
                                <span className="font-bold text-xl text-primary">₦{currentBid.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Gavel className="h-3 w-3" />
                                    <span>{bidCount} bid{bidCount !== 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <Button className="w-full gap-2" variant="outline" disabled>
                              <Clock className="h-4 w-4" />
                              Auction Ended
                            </Button>
                          </div>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground">No past auctions.</div>
          )}
        </section>
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
