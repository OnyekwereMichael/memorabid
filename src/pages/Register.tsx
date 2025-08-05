import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Gavel, Mail, Lock, User, Store, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { authAPI, RegisterData } from "@/lib/api";
import { RegisterSchema } from "@/lib/validation";

// Validation schema

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialValues: RegisterData = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
    phone: "",
  };

  const handleSubmit = async (values: RegisterData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true);
    setSubmitting(true);
    try {
      // Check if email is available for the selected role
      // const emailCheck = await authAPI.checkEmailAvailability(values.email, values.role);
      // if (!emailCheck.success) {
      //   toast({
      //     title: "Email Check Failed",
      //     description: emailCheck.message || "Failed to verify email availability.",
      //     variant: "destructive",
      //   });
      //   return;
      // }
      
      // if (!emailCheck.available) {
      //   setFieldError('email', `This email is already registered as a ${values.role === 'admin' ? 'different role' : values.role}. Please use a different email or try logging in.`);
      //   return;
      // }

      // Always send the selected role
      const response = await authAPI.register({ ...values, role: values.role });
      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: response.message || "Your account has been created successfully.",
        });
        navigate("/login");
      } else {
        if (response.errors) {
          Object.keys(response.errors).forEach((field) => {
            setFieldError(field, response.errors![field][0]);
          });
        } else {
          toast({
            title: "Registration Failed",
            description: response.message || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col pt-8 items-start w-[35%] bg-[#4B187C] px-8 text-white min-h-full">
          <h1 className="text-3xl font-bold mb-4">Welcome to Memorabid</h1>
          <p className="mb-8 text-lg opacity-90 max-w-md">
            A platform designed to help you ace interviews with personalized practice, instant feedback, and expert guidance.
          </p>
          <ul className="mb-8 space-y-4">
            <li className="flex items-center gap-3 text-base"><span className="text-green-400">✔</span> Create and manage interactive auctions in minutes</li>
            <li className="flex items-center gap-3 text-base"><span className="text-blue-300">👥</span> Invite participants with secure email verification for hosts</li>
            <li className="flex items-center gap-3 text-base"><span className="text-yellow-300">🎓</span> Flexible auction types — Standard, Reserve, and Buy Nows</li>
          </ul>
          <blockquote className="italic text-sm opacity-80 max-w-md mb-2">"This platform made it incredibly easy to run my first auction. The experience was smooth, and everything just worked."</blockquote>
          <span className="font-bold text-base">– Ada, Independent Seller</span>
        </div>
        {/* Right Panel */}
        <div className="flex flex-col pt-4 sm:pt-8 items-center w-full md:w-[65%] px-4 sm:px-8 min-h-full">
          <div className="w-full max-w-md sm:max-w-none">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#A259FF] mb-2">Sign Up</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-md">Create your account to get started.</p>
            </div>
            <Card className="shadow-elegant border-0 bg-background/80">
              <CardContent className="py-6 px-4 sm:py-8 sm:px-8">
                <Formik
                  initialValues={initialValues}
                  validationSchema={RegisterSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-6">
                      {/* Account Type Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Account Type</Label>
                        <RadioGroup
                          value={values.role}
                          onValueChange={(value) => setFieldValue("role", value)}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                        >
                          <div className="flex items-center space-x-3 border border-border/50 rounded-xl p-3 sm:p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                            <RadioGroupItem value="user" id="user" />
                            <Label htmlFor="user" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              <div>
                                <span className="font-medium text-sm sm:text-base">User</span>
                                <p className="text-xs text-muted-foreground">Participate in auctions</p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border border-border/50 rounded-xl p-3 sm:p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                            <RadioGroupItem value="seller" id="seller" />
                            <Label htmlFor="seller" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
                              <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              <div>
                                <span className="font-medium text-sm sm:text-base">Seller</span>
                                <p className="text-xs text-muted-foreground">Create and Monitor Auctions</p>
                              </div>
                            </Label>
                          </div>
                          {/* <div className="flex items-center space-x-3 border border-border/50 rounded-xl p-3 sm:p-4 bg-background/50 hover:bg-background/80 transition-all cursor-pointer">
                            <RadioGroupItem value="admin" id="admin" />
                            <Label htmlFor="admin" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
                              <Gavel className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              <div>
                                <span className="font-medium text-sm sm:text-base">Admin</span>
                                <p className="text-xs text-muted-foreground">Manage Platform</p>
                              </div>
                            </Label>
                          </div> */}
                        </RadioGroup>
                        {errors.role && touched.role && (
                          <div className="text-red-500 text-sm">{errors.role}</div>
                        )}
                      </div>

                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-medium">Full Name</Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className="bg-background/50 border-border/50"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-9 bg-background/50 border-border/50"
                          />
                        </div>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="phone"
                            name="phone"
                            placeholder="+1234567890"
                            className="pl-9 bg-background/50 border-border/50"
                          />
                        </div>
                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Field
                              as={Input}
                              id="password"
                              name="password"
                              type="password"
                              placeholder="Create password"
                              className="pl-9 bg-background/50 border-border/50"
                            />
                          </div>
                          <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password_confirmation" className="font-medium">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Field
                              as={Input}
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              placeholder="Confirm password"
                              className="pl-9 bg-background/50 border-border/50"
                            />
                          </div>
                          <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-sm" />
                        </div>
                      </div>

                      <Button type="submit" className="w-full shadow-elegant" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <div className="mt-8 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#A259FF] hover:underline font-medium">
                      Sign in
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

export default Register;