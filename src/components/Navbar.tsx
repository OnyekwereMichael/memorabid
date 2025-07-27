import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Gavel, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  userRole?: 'admin' | 'seller' | null;
  userName?: string;
}

const Navbar = ({ userRole, userName }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear authentication state here
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass glass-dark shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow">
              <Gavel className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AuctionPro
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {userRole && userName && (
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
            )}
            
            {!userRole && (
              <>
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="shadow-elegant">
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;