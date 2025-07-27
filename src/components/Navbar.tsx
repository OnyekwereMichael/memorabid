import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Gavel, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AuctionPro
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {userRole && userName && (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{userName}</span>
                  <Badge variant={userRole === 'admin' ? 'destructive' : 'secondary'}>
                    {userRole === 'admin' ? 'Admin' : 'Seller'}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
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