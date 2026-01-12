import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Instagram } from "lucide-react";
import serviceLaser from "@/assets/service-laser.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceSlimming from "@/assets/service-slimming.jpg";
import clinicInterior from "@/assets/clinic-interior.jpg";
import serviceDiamondPeel from "@/assets/service-diamond-peel.jpg";
import serviceWhitening from "@/assets/service-whitening.jpg";
import serviceAcne from "@/assets/service-acne.jpg";
import serviceAntiaging from "@/assets/service-antiaging.jpg";

const posts = [
  { image: serviceLaser },
  { image: clinicInterior },
  { image: serviceFacial },
  { image: serviceSlimming },
  { image: serviceDiamondPeel },
  { image: serviceWhitening },
  { image: serviceAcne },
  { image: serviceAntiaging },
];

const SocialFeed = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-10 md:py-14 bg-cream" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Stay Connected
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base max-w-xl mx-auto px-2">
            Follow us on social media to stay connected with our beauty community.
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2 lg:gap-3">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={post.image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                className="absolute inset-0 bg-accent/60 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: hoveredIndex === index ? 1 : 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Instagram className="w-8 h-8 text-accent-foreground" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Instagram Handle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-6"
        >
          <a
            href="https://instagram.com/skinstation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors text-sm"
          >
            <Instagram className="w-4 h-4" />
            @SkinStation
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialFeed;
