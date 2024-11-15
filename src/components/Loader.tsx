import React from "react";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="min-h-[600px] h-screen flex items-center justify-center fixed top-0 left-0 z-10 w-full overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex-[1] h-full -mx-1 flex flex-col">
          <motion.div
            exit={{
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.5, delay: 2 + 0.05 * i },
            }}
            className="h-[51%] bg-black -my-1"
          />
          <motion.div
            exit={{
              clipPath: "inset(100% 0 0 0)",
              transition: { duration: 0.5, delay: 2 + 0.05 * i },
            }}
            className="h-[51%] bg-black -my-1"
          />
        </div>
      ))}
    </div>
  );
}

export default Loader;
