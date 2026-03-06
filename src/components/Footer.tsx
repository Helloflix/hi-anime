import { Link } from "react-router-dom";
import { Github, Twitter, MessageCircle, Play, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    browse: [
      { name: "Most Popular", href: "/most-popular" },
      { name: "Movies", href: "/movies" },
      { name: "TV Series", href: "/tv-series" },
      { name: "A-Z List", href: "/az-list" },
    ],
    support: [
      { name: "Help Center", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  return (
    <footer className="relative border-t border-[hsl(180_100%_50%/0.06)] bg-[hsl(240_30%_4%/0.8)] backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] shadow-[0_0_15px_hsl(180_100%_50%/0.3)]">
                <Play className="h-6 w-6 text-[hsl(240_30%_5%)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[hsl(180_100%_50%)] to-[hsl(300_100%_50%)] bg-clip-text text-transparent">Helloflix</span>
                <span className="text-xs text-muted-foreground font-medium">Stream Anime</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Your ultimate destination for streaming the latest and greatest anime content.
            </p>
            <div className="flex items-center space-x-3">
              {[MessageCircle, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-[hsl(180_100%_50%/0.1)] hover:text-[hsl(180_100%_50%)] transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-sm text-muted-foreground hover:text-[hsl(180_100%_50%)] transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-[hsl(180_100%_50%/0.06)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Helloflix.</span>
              <span>All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
              <span>for anime fans</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
