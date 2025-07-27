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
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted">
      <Navbar />
      
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Gavel className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Join AuctionPro</h1>
            <p className="text-muted-foreground">Create your account to start bidding or selling</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Account Type</Label>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={(value) => handleInputChange("accountType", value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="bidder" id="bidder" />
                      <Label htmlFor="bidder" className="flex items-center space-x-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Bidder Only</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller" className="flex items-center space-x-2 cursor-pointer">
                        <Store className="h-4 w-4" />
                        <span>Request to be Seller</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seller-specific fields */}
                {formData.accountType === "seller" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name (Optional)</Label>
                      <Input
                        id="businessName"
                        placeholder="Your business or trading name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Tell us about yourself</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your experience with collectibles, what you plan to sell, etc."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps our admin team review your seller application
                      </p>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? "Creating Account..." 
                    : formData.accountType === "seller"
                    ? "Submit Seller Application"
                    : "Create Account"
                  }
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
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