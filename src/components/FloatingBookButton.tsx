import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingBookButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="gradient-accent text-accent-foreground shadow-elevated rounded-full px-6 py-6 flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          <span className="hidden sm:inline">Book Now</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FloatingBookButton;
