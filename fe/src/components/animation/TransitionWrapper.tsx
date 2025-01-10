import React from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router";

interface TransitionWrapperProps {
  children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, scale: 0.9 }} // Start slightly smaller
      animate={{ opacity: 1, scale: 1 }} // Grow to full size
      exit={{ opacity: 0, scale: 1.1 }} // Slightly larger before fading
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionWrapper;
