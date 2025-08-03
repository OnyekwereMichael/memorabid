import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clock, Users, Gavel, Plus, Heart, Share2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatAuctionTime } from "@/lib/utils";
import type { Auction } from "@/lib/api";

const SingleAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAuctionData();
    }
  }, [id]);

  const fetchAuctionData = async () => {
    try {
      const response = await adminAPI.fetchAuctions();
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch auctions');
      }
      const foundAuction = response.data.find((a: Auction) => a.id.toString() === id);
      
      if (!foundAuction) {
        toast({
          title: "Auction not found",
          description: "The auction you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/auction");
        return;
      }
      
      setAuction(foundAuction);
    } catch (error) {
      console.error('Error fetching auction:', error);
      toast({
        title: "Error",
        description: "Failed to load auction details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    if (!auction) return;
    const nextBid = auction.starting_bid + (auction.bid_increment || 10);
    setBidAmount(nextBid.toString());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading auction...</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Auction not found</h2>
          <Button onClick={() => navigate("/auction")}>Back to Auctions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/auction")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auctions
        </Button>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{auction.title}</h1>
            <p className="text-muted-foreground">by {auction.user.name}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Watch
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                {auction.media_url ? (
                  <img src={auction.media_url} alt={auction.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gavel className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{auction.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  ${auction.starting_bid.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Starting Price</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bid-amount">Your Bid</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="bid-amount"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        className="pl-8"
                      />
                    </div>
                    <Button variant="outline" onClick={handleIncrement} className="px-3">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-bid" className="text-sm font-medium">Auto Bid</Label>
                    <Switch
                      id="auto-bid"
                      checked={autoBidEnabled}
                      onCheckedChange={setAutoBidEnabled}
                    />
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Place Bid
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleAuction;