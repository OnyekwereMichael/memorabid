import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Gavel, Mail, Lock, User, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "seller",
    businessName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration Successful!",
        description: formData.accountType === "seller" 
          ? "Your seller request has been submitted for admin approval."
          : "Please check your email for verification.",
      });
      navigate("/login");
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl mb-6 shadow-elegant">
              <Gavel className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Join AuctionPro
            </h1>
            <p className="text-muted-foreground mt-2">Create your account to start bidding or selling</p>
          </div>

          <Card className="modern-card modern-card-dark shadow-elegant border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription className="text-base">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Account Type</Label>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={(value) => handleInputChange("accountType", value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-3 border border-border/50 rounded-xl p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                      <RadioGroupItem value="bidder" id="bidder" />
                      <Label htmlFor="bidder" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Bidder Only</span>
                          <p className="text-xs text-muted-foreground">Participate in auctions</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border border-border/50 rounded-xl p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Store className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-medium">Seller Request</span>
                          <p className="text-xs text-muted-foreground">Sell your items</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-background/50 border-border/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-background/50 border-border/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-9 bg-background/50 border-border/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-9 bg-background/50 border-border/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-9 bg-background/50 border-border/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seller-specific fields */}
                {formData.accountType === "seller" && (
                  <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center space-x-2 mb-3">
                      <Store className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Seller Information</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="font-medium">Business Name (Optional)</Label>
                      <Input
                        id="businessName"
                        placeholder="Your business or trading name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        className="bg-background/70 border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-medium">Tell us about yourself</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your experience with collectibles, what you plan to sell, etc."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        className="bg-background/70 border-border/50 resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps our admin team review your seller application
                      </p>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full shadow-elegant" disabled={isLoading}>
                  {isLoading 
                    ? "Creating Account..." 
                    : formData.accountType === "seller"
                    ? "Submit Seller Application"
                    : "Create Account"
                  }
                </Button>
              </form>

              <div className="mt-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center justify-center">
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;