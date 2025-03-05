
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">LeadWise</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              "nav-link",
              location.pathname === "/" && "text-blue-600 font-semibold"
            )}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={cn(
                  "nav-link",
                  location.pathname === "/dashboard" && "text-blue-600 font-semibold"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/campaigns"
                className={cn(
                  "nav-link",
                  location.pathname.includes("/campaigns") && "text-blue-600 font-semibold"
                )}
              >
                Campaigns
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <User className="h-5 w-5 text-blue-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/90 backdrop-blur-md"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-sm font-medium">{user?.username}</span>
                </DropdownMenuItem>
                {user?.companyName && (
                  <DropdownMenuItem disabled>
                    <span className="text-sm">{user.companyName}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
