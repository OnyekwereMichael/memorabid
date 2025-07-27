import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Shield, TrendingUp, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Award className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Premium Memorabilia Auctions</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Discover Rare Collectibles at
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AuctionPro
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The premier destination for authenticated sports memorabilia, vintage collectibles, 
            and exclusive items. Join thousands of collectors in our trusted marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/login">Start Bidding</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/register">Become a Seller</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AuctionPro?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Authenticated Items</CardTitle>
                <CardDescription>
                  Every item comes with certificates of authenticity and rigorous verification
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Trusted Community</CardTitle>
                <CardDescription>
                  Join thousands of verified collectors and dealers in our secure marketplace
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>
                  Access real-time market data and historical pricing for informed bidding
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Auctions Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Auctions</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Gavel className="h-16 w-16 text-primary/30" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Vintage Baseball Card Collection</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Rare 1952 Topps Mickey Mantle PSA 9
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Bid</p>
                      <p className="text-lg font-bold text-primary">${(Math.random() * 50000 + 10000).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(Math.random() * 48)}h left
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/login">View All Auctions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 AuctionPro. All rights reserved. | Secure • Trusted • Authentic
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;