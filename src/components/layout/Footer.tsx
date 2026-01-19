import { Link } from "react-router-dom";
import { Leaf, Linkedin, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-eco-leaf shadow-eco">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                Eco<span className="text-primary">Learn</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empowering the next generation of innovators with AI skills and environmental awareness. 
              Learn, build, and make a real impact on our planet through hands-on projects.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com/company/ecolearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/ecolearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@ecolearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@ecolearn.com"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Learning Section */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-5">Learning</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/tracks" className="hover:text-primary transition-colors">AI Innovation Track</Link></li>
              <li><Link to="/tracks" className="hover:text-primary transition-colors">Environmental Track</Link></li>
              <li><Link to="/tasks" className="hover:text-primary transition-colors">Hands-on Projects</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Eco Quiz Battles</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Workshops</Link></li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-5">Community</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Learner Network</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Discussion Groups</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Events & Meetups</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>EcoLearn Innovation Hub,<br />Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:hello@ecolearn.com" className="hover:text-primary transition-colors">
                  hello@ecolearn.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EcoLearn. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <span className="text-primary">💚</span> for a sustainable future
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
