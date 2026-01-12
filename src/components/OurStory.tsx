import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import clinicInterior from "@/assets/clinic-interior.jpg";

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-10 md:py-14 bg-cream-dark relative overflow-hidden" ref={ref}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M50,200 Q150,100 250,200 T450,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
          />
          <path
            d="M50,250 Q150,150 250,250 T450,250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-elevated">
              <img
                src={clinicInterior}
                alt="SkinStation Clinic Interior"
                className="w-full h-[220px] md:h-[300px] lg:h-[380px] object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 w-24 h-24 gradient-accent rounded-xl -z-10"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-foreground mb-3 md:mb-4">
              Our Story
            </h2>
            <div className="space-y-2 md:space-y-3 text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed">
              <p>
                SkinStation combines laser and science to give you the best results in skin and body services.
              </p>
              <p>
                Our trained experts bring innovative solutions including dermatology, laser treatments, anti-aging, and slimming at affordable prices.
              </p>
            </div>
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.02 }}
            >
              <Button
                size="default"
                className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full px-6 text-sm"
              >
                Read More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
