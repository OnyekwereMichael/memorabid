import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Gavel, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getCookie, removeCookie } from "@/lib/utils";

interface NavbarProps {
  userRole?: 'admin' | 'seller' | null;
  userName?: string;
}

const Navbar = ({ userRole, userName }: NavbarProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    const token = getCookie('token');
    const response = await authAPI.logout(token || undefined);
    if (response.success) {
      toast({
        title: "Logged out successfully",
        description: response.message || "You have been logged out.",
      });
      removeCookie('token');
      navigate('/');
    } else {
      toast({
        title: "Logout Failed",
        description: response.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Nav links (for reuse)
  const navLinks = (
    <>
      {userRole && userName ? (
        <>
          <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-background/50 border border-border/50">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{userName}</span>
            <Badge 
              variant={userRole === 'admin' ? 'destructive' : 'secondary'}
              className="shadow-soft"
            >
              {userRole === 'admin' ? 'Admin' : 'Seller'}
            </Badge>
          </div>
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center space-x-1 shadow-soft"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </>
      ) : (
        <>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="shadow-elegant">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button size="sm" asChild className="shadow-elegant">
            <Link to="/login">Auction</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass glass-dark shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
              <Gavel className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ECC
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">{navLinks}</div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7 text-primary" />
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <span className="text-lg font-semibold">Menu</span>
              <button
                className="p-2 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-2 p-4">
              {navLinks}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;