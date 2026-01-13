import { motion } from "framer-motion";
import { useState } from "react";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const [email, setEmail] = useState("");

  const footerLinks = {
    Company: ["History", "About Us", "Blogs"],
    Services: ["Hair Removal", "Anti-Acne Treatment", "Anti-Aging Treatment", "Body Laser", "Facials and Peels", "Slimming and Firming", "Gluta Whitening"],
    Help: ["Find Your Skin", "Data Privacy", "FAQs"],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  return (
    <footer className="bg-green-deep text-accent-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-8 lg:gap-6">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-2 md:mb-3">
                <img 
                  src="https://i.imgur.com/9beP2dq.png" 
                  alt="SkinStation Logo" 
                  className="h-5 md:h-6 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-accent-foreground/70 text-[10px] md:text-xs leading-relaxed">
                Your trusted partner in achieving radiant, healthy skin.
              </p>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">{title}</h4>
              <ul className="space-y-1 md:space-y-1.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-accent-foreground/70 hover:text-accent-foreground transition-colors text-[10px] md:text-xs"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">Follow Us</h4>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-3 h-3 md:w-4 md:h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-accent-foreground/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs text-accent-foreground/70">📧</span>
              <Input
                type="email"
                placeholder="Subscribe your email for R today"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/50 w-full md:w-64 text-xs h-8"
              />
              <Button className="bg-brown-light hover:bg-brown-light/90 text-accent-foreground whitespace-nowrap text-xs h-8 px-4">
                Book Now
              </Button>
            </div>

            {/* Business Registration */}
            <div className="flex items-center gap-2 text-[10px] text-accent-foreground/50">
              <div className="w-12 h-8 bg-accent-foreground/10 rounded flex items-center justify-center">
                <span className="text-[6px]">FDA Registered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 pt-4 border-t border-accent-foreground/10 text-center"
        >
          <p className="text-accent-foreground/50 text-xs">
            © {new Date().getFullYear()} SkinStation. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
