import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, Shield, TrendingUp, Users, Award, Clock, Star, CheckCircle, Trophy, Globe, Zap, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/cricket-hero.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gradient-section to-muted/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/20 to-primary-glow/20 backdrop-blur-sm border border-primary/20 rounded-full mb-6 sm:mb-8 shadow-glow">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3" />
                <span className="text-xs sm:text-sm font-semibold text-primary">Exclusive Cricket Collectibles</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent leading-snug sm:leading-tight tracking-wide sm:tracking-wider text-center">
  Discover&nbsp;Cricket&nbsp;Legends&nbsp;at&nbsp;<span className="whitespace-nowrap">ECC</span>
</h1>

              
              <p className="text-[16px] sm:text-xl md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl lg:mx-0 mx-auto leading-relaxed">
                The premier destination for authenticated cricket memorabilia, vintage equipment, 
                and exclusive collectibles. Join thousands of cricket enthusiasts in our trusted marketplace.
              </p>
            </div>
            
            {/* Hero Image */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-feature">
                <img 
                  src={heroImage} 
                  alt="Cricket memorabilia auction items" 
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-12 sm:mb-20">
            <Button asChild size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-elegant hover:shadow-glow transition-all duration-300 w-full sm:w-auto">
              <Link to="/login">Start Bidding</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 border-2 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto">
              <Link to="/register">Become a Seller</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { label: "Active Auctions", value: "1,800+" },
              { label: "Verified Sellers", value: "650+" },
              { label: "Total Sales", value: "$8M+" },
              { label: "Cricket Fans", value: "25K+" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">Why Choose ECC?</h2>
            <p className="text-[16px] text-muted-foreground max-w-3xl mx-auto">
              Experience the most trusted and advanced auction platform for cricket collectibles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group text-center hover:shadow-feature transition-all duration-300 border-0 shadow-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Authenticated Items</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Every item comes with certificates of authenticity and rigorous verification by industry experts
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group text-center hover:shadow-feature transition-all duration-300 border-0 shadow-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Trusted Community</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Join thousands of verified collectors and dealers in our secure marketplace with 24/7 support
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group text-center hover:shadow-feature transition-all duration-300 border-0 shadow-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Market Insights</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Access real-time market data, historical pricing, and AI-powered valuation tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/40 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">How ECC Works</h2>
            <p className="text-[16px] text-muted-foreground max-w-3xl mx-auto">
              Simple, secure, and transparent auction process for cricket enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                description: "Explore thousands of authenticated collectibles with detailed photos, certificates, and expert descriptions.",
                icon: <Eye className="h-8 w-8" />
              },
              {
                step: "02", 
                title: "Bid with Confidence",
                description: "Place bids with our secure system. Real-time notifications keep you updated on auction status.",
                icon: <Gavel className="h-8 w-8" />
              },
              {
                step: "03",
                title: "Win & Collect",
                description: "Secure payment processing and insured worldwide shipping ensure your treasures arrive safely.",
                icon: <Trophy className="h-8 w-8" />
              }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto text-white shadow-glow">
                    {step.icon}
                  </div>
                  <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background text-primary border-2 border-primary">
                    {step.step}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Auctions Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">Featured Auctions</h2>
            <p className="text-[16px] text-muted-foreground max-w-3xl mx-auto">
              Don't miss these rare finds ending soon
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1983 World Cup Winning Bat",
                category: "Cricket Bats",
                currentBid: 45000,
                timeLeft: "2h 45m",
                watchers: 234,
                featured: true
              },
              {
                title: "Sachin Tendulkar Signed Jersey",
                category: "Cricket Memorabilia", 
                currentBid: 78000,
                timeLeft: "1d 12h",
                watchers: 156,
                featured: false
              },
              {
                title: "Vintage Cricket Ball Collection",
                category: "Cricket Equipment",
                currentBid: 32000,
                timeLeft: "3h 21m", 
                watchers: 89,
                featured: false
              }
            ].map((auction, i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-feature transition-all duration-300 border-0 shadow-card">
                <div className="relative h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Gavel className="h-20 w-20 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
                  {auction.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-primary-glow text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 flex items-center bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
                    <Eye className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">{auction.watchers}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs">{auction.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {auction.title}
                  </h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                      <p className="text-2xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {auction.timeLeft} left
                      </div>
                      <Button size="sm" className="px-4">Place Bid</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
              <Link to="/login">View All Auctions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/40 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">Trusted Worldwide</h2>
            <p className="text-[16px] text-muted-foreground max-w-3xl mx-auto">
              Security and authenticity you can depend on
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-sm:grid-cols-2">
            {[
              { icon: <Shield className="h-8 w-8" />, title: "256-bit SSL", description: "Bank-level security" },
              { icon: <CheckCircle className="h-8 w-8" />, title: "100% Authentic", description: "Verified by experts" },
              { icon: <Globe className="h-8 w-8" />, title: "Global Shipping", description: "Worldwide delivery" },
              { icon: <Zap className="h-8 w-8" />, title: "Instant Notifications", description: "Real-time updates" }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-5xl font-bold mb-6">Ready to Start Your Cricket Collection?</h2>
          <p className="text-[16px] text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join ECC today and discover rare cricket collectibles from trusted sellers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-7 shadow-elegant">
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 border-2">
              <Link to="/login">Sign In to Bid</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-card to-muted/30 border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Gavel className="h-5 w-5 text-primary mr-2" />
                ECC
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world's premier destination for authenticated cricket collectibles and memorabilia auctions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Marketplace</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Browse Auctions</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sell Items</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Authentication</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 ECC - Exclusive Club Cricket. All rights reserved. | Secure • Trusted • Authentic
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;