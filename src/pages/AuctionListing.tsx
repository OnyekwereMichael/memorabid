import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, Users, Gavel } from "lucide-react";
import { adminAPI } from "@/lib/api";
import type { Auction } from "@/lib/api";

const AuctionListing = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await adminAPI.fetchAuctions();
      if (response.success && response.data) {
        setAuctions(response.data);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Live Auctions</h1>
        <p className="text-muted-foreground text-lg">Discover and bid on amazing items</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAuctions.map((auction) => (
          <Card key={auction.id} className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardHeader className="p-0">
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                {auction.media_url ? (
                  <img
                    src={auction.media_url}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gavel className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="default">Live</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {auction.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {auction.user.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Starting Bid</span>
                    <span className="font-semibold text-lg text-primary">
                      ${auction.starting_bid.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeLeft(auction.auction_end_time)}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      0 bids
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/auction/${auction.id}`)}
                >
                  Bid Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
          <p className="text-muted-foreground">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default AuctionListing;