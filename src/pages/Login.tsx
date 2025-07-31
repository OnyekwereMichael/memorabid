import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Mail, Lock, Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginSchema } from "@/lib/validation";
import { authAPI } from "@/lib/api";
import { setCookie } from "@/lib/utils";

const Login = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting, setFieldError }: any, userType: "admin" | "seller" | "user") => {
    setIsLoading(true);
    setSubmitting(true);
    try {
      const response = await authAPI.login({ ...values, role: userType });
      if (response.success) {
        toast({
          title: "Login Successful!",
          description: response.message || "You have logged in successfully.",
        });
        if (response.token) {
          setCookie('token', response.token);
        }
        if (response.data) {
          setCookie('userData', JSON.stringify(response.data));
        }
        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else if (userType === "seller") {
          navigate("/seller-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        if (response.errors) {
          Object.keys(response.errors).forEach((field) => {
            setFieldError(field, response.errors![field][0]);
          });
        }
        toast({
          title: "Login Failed",
          description: response.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const initialValues = { email: "", password: "" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="hidden  md:flex flex-col pt-8 items-start w-[35%] bg-[#4B187C] px-8  text-white min-h-full">
          <h1 className="text-3xl font-bold mb-4">Welcome to Memorabid</h1>
          <p className="mb-8 text-lg opacity-90 max-w-md">
            A platform designed to help you ace interviews with personalized practice, instant feedback, and expert guidance.
          </p>
          <ul className="mb-8 space-y-4">
            <li className="flex items-center gap-3 text-base"><span className="text-green-400">✔</span> Create and manage interactive auctions in minutes</li>
            <li className="flex items-center gap-3 text-base"><span className="text-blue-300">👥</span> Invite participants with secure email verification for hosts</li>
            <li className="flex items-center gap-3 text-base"><span className="text-yellow-300">🎓</span> Flexible auction types — Standard, Reserve, and Buy Nows</li>
          </ul>
          <blockquote className="italic text-sm opacity-80 max-w-md mb-2">“This platform made it incredibly easy to run my first auction. The experience was smooth, and everything just worked.”</blockquote>
          <span className="font-bold text-base">– Ada, Independent Seller</span>
        </div>
        {/* Right Panel */}
        <div className="flex flex-col pt-8 items-center w-full md:w-[65%] px-8 max-sm:px-2  min-h-full">
          <div className="w-full ">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#A259FF] mb-2">Hi!!</h2>
              <p className="text-muted-foreground mb-6">Enter details to login.</p>
            </div>
            <Card className="shadow-elegant border-0 bg-background/80">
            <CardContent className="py-8 px-8 max-sm:px-4 max-sm:py-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/30 p-1">
                    <TabsTrigger value="user" className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs">
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </TabsTrigger>
                    <TabsTrigger value="seller" className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs">
                    <Gavel className="h-4 w-4" />
                    <span>Seller</span>
                  </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center space-x-2 data-[state=active]:shadow-soft text-xs">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>
                  {/* User Tab */}
                <TabsContent value="user" className="space-y-6">
  <Formik
    initialValues={initialValues}
    validationSchema={LoginSchema}
    onSubmit={(values, actions) => handleSubmit(values, actions, "user")}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="user-email" name="email" type="email" placeholder="user@auctionpro.com" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="user-password" name="password" type="password" placeholder="Enter your password" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link to="#" className="text-xs text-[#A259FF] hover:underline">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full shadow-elegant" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </Form>
    )}
  </Formik>
</TabsContent>
                  {/* Seller Tab */}
                <TabsContent value="seller" className="space-y-6">
  <Formik
    initialValues={initialValues}
    validationSchema={LoginSchema}
    onSubmit={(values, actions) => handleSubmit(values, actions, "seller")}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seller-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="seller-email" name="email" type="email" placeholder="seller@auctionpro.com" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seller-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="seller-password" name="password" type="password" placeholder="Enter your password" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link to="#" className="text-xs text-[#A259FF] hover:underline">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full shadow-elegant" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </Form>
    )}
  </Formik>
</TabsContent>
                  {/* Admin Tab */}
                <TabsContent value="admin" className="space-y-6">
  <Formik
    initialValues={initialValues}
    validationSchema={LoginSchema}
    onSubmit={(values, actions) => handleSubmit(values, actions, "admin")}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="admin-email" name="email" type="email" placeholder="admin@auctionpro.com" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Field as={Input} id="admin-password" name="password" type="password" placeholder="Enter admin password" className="pl-9 bg-background/50 border-border/50" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link to="#" className="text-xs text-[#A259FF] hover:underline">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full shadow-elegant" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </Form>
    )}
  </Formik>
</TabsContent>
              </Tabs>
              <div className="mt-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                    No account yet?{' '}
                    <Link to="/register" className="text-[#A259FF] hover:underline font-medium">
                      Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;