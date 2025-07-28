import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Mail, Lock, Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [sellerData, setSellerData] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent, userType: "admin" | "seller" | "user") => {
    e.preventDefault();
    setIsLoading(true);

    const currentData = userType === "admin" ? adminData : userData;

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      if (userType === "admin") {
        toast({
          title: "Welcome back, Admin!",
          description: "Redirecting to admin dashboard...",
        });
        navigate("/admin-dashboard");
      } else if (userType === "seller") {
        toast({
          title: "Welcome back, Seller!",
          description: "Redirecting to seller dashboard...",
        });
        navigate("/seller-dashboard");
      } else {
        toast({
          title: "Welcome back!",
          description: "Redirecting to user dashboard...",
        });
        navigate("/user-dashboard");
      }
    }, 1500);
  };

  const handleInputChange = (field: string, value: string, userType: "admin" | "seller" | "user") => {
    if (userType === "admin") {
      setAdminData(prev => ({ ...prev, [field]: value }));
    } else if (userType === "seller") {
      setSellerData(prev => ({ ...prev, [field]: value }));
    } else {
      setUserData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl mb-6 shadow-elegant">
              <Gavel className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">Choose your account type to continue</p>
          </div>

          <Card className="modern-card modern-card-dark shadow-elegant border-0">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30 p-1">
                  <TabsTrigger 
                    value="user" 
                    className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs"
                  >
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seller" 
                    className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs"
                  >
                    <Gavel className="h-4 w-4" />
                    <span>Seller</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin" 
                    className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold">User Access</h3>
                    <p className="text-sm text-muted-foreground">Access your user dashboard</p>
                  </div>
                  
                  <form onSubmit={(e) => handleLogin(e, "user")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="user-email"
                          type="email"
                          placeholder="user@auctionpro.com"
                          value={userData.email}
                          onChange={(e) => handleInputChange("email", e.target.value, "user")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="user-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="user-password"
                          type="password"
                          placeholder="Enter your password"
                          value={userData.password}
                          onChange={(e) => handleInputChange("password", e.target.value, "user")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full shadow-elegant" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as User"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="seller" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold">Seller Access</h3>
                    <p className="text-sm text-muted-foreground">Access your seller dashboard</p>
                  </div>
                  
                  <form onSubmit={(e) => handleLogin(e, "seller")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="seller-email"
                          type="email"
                          placeholder="seller@auctionpro.com"
                          value={sellerData.email}
                          onChange={(e) => handleInputChange("email", e.target.value, "seller")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seller-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="seller-password"
                          type="password"
                          placeholder="Enter your password"
                          value={sellerData.password}
                          onChange={(e) => handleInputChange("password", e.target.value, "seller")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full shadow-elegant" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Seller"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="admin" className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold">Admin Access</h3>
                    <p className="text-sm text-muted-foreground">Access admin dashboard with full privileges</p>
                  </div>
                  
                  <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@auctionpro.com"
                          value={adminData.email}
                          onChange={(e) => handleInputChange("email", e.target.value, "admin")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter admin password"
                          value={adminData.password}
                          onChange={(e) => handleInputChange("password", e.target.value, "admin")}
                          className="pl-9 bg-background/50 border-border/50"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full shadow-elegant" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Admin"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Sign up here
                  </Link>
                </p>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center justify-center">
                  ← Back to home
                </Link>
              </div>

              <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border/30">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <p className="font-medium text-foreground">Admin</p>
                    <p className="text-muted-foreground">admin@auctionpro.com</p>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <p className="font-medium text-foreground">Seller</p>
                    <p className="text-muted-foreground">seller@auctionpro.com</p>
                  </div>
                </div>
                <div className="mt-2 text-center p-2 bg-background/50 rounded-lg">
                  <p className="font-medium text-foreground">User</p>
                  <p className="text-muted-foreground">user@auctionpro.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;