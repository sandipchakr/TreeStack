import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm rounded-2xl z-50">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
