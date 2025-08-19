import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">
                Digital Aadhti Blog
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a 
                  className={`text-secondary hover:text-primary transition-colors ${
                    location === href ? "text-primary font-medium" : ""
                  }`}
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  {label}
                </a>
              </Link>
            ))}
            <Link href="/editor">
              <Button className="bg-accent text-white hover:bg-blue-600" data-testid="nav-new-post">
                <i className="fas fa-plus mr-2"></i>New Post
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-trigger">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <a 
                      className={`block py-2 text-secondary hover:text-primary transition-colors ${
                        location === href ? "text-primary font-medium" : ""
                      }`}
                      data-testid={`mobile-nav-${label.toLowerCase()}`}
                    >
                      {label}
                    </a>
                  </Link>
                ))}
                <Link href="/editor">
                  <Button className="w-full bg-accent text-white hover:bg-blue-600" data-testid="mobile-nav-new-post">
                    <i className="fas fa-plus mr-2"></i>New Post
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
