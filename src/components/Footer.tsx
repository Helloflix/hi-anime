import { Link } from "react-router-dom";
import { Github, Twitter, MessageCircle, Heart, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/20 backdrop-blur py-6">
      <div className="container px-4">
        <div className="flex items-center justify-center space-x-6">
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Discord"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Github"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;