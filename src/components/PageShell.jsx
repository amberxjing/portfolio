import { motion } from "framer-motion";

export default function PageShell({ children, className = "" }) {
  return (
    <motion.main
      className={`page-shell ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.34, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.main>
  );
}
