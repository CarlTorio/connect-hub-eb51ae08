import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I've been a loyal SkinStation cliente since I first tried their Hair Removal services! After years of laser, I am now hairless and hair-free!",
    author: "Caitlin Anne Capas",
    avatar: "CC",
  },
  {
    quote: "Amazing results! Dr. Olazo and her team are professional! For Tatoo removal and hair removal, this is the best clinic that I found!",
    author: "Daya Delgado",
    avatar: "DD",
  },
  {
    quote: "I have my moms be 2-decades! Two after great results, my skin looks so much better! Definitely coming back!",
    author: "Bianca Tan",
    avatar: "BT",
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-10 md:py-14 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-lg md:text-2xl lg:text-3xl font-semibold text-foreground text-center mb-6 md:mb-10 px-2"
        >
          Read What They Loved About SkinStation
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-card transition-shadow duration-300 h-full">
                {/* Quote Icon */}
                <div className="mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 gradient-accent rounded-full flex items-center justify-center">
                    <Quote className="w-3 h-3 md:w-4 md:h-4 text-accent-foreground" />
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-foreground/80 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm lg:text-base italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 gradient-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-xs md:text-sm">
                    {testimonial.avatar}
                  </div>
                  <span className="font-semibold text-foreground text-xs md:text-sm">
                    {testimonial.author}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
