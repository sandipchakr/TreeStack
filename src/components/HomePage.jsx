import React from "react";
import { Link } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";
import filesystemphoto from "../assets/file.svg"

function HomePage() {
  // Parent animation (controls stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // delay between children animations
      },
    },
  };

  // Child animation (each span)
  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col md:flex-row  justify-evenly items-start md:items-center h-auto md:h-screen m-1.5 gap-5 bg-gradient-to-bl
    from-[#020b1a] to-[#013108]">
      {/* Animated text container */}
      <motion.div
        className="flex flex-col justify-start items-start h-full gap-4 m-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={childVariants} className="text-green-500 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Manage
        </motion.span>
        <motion.span variants={childVariants} className="text-[#6ca87be3] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Your videos with
        </motion.span>
        <motion.span variants={childVariants} className="text-green-500 text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          TreeStack
        </motion.span>

        <motion.div
          variants={childVariants}
          className="bg-green-500 px-4 py-2 rounded-2xl text-black text-lg font-bold"
        >
          <Link to="/signin" className="w-full h-full">
            <span>Let's Manage</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="w-full sm:w-2/3 md:w-2/3 lg:w-1/3
          h-56 sm:h-72 md:h-2/3  bg-[#051547e1] rounded-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{opacity:1,scale:1}}
        transition={{duration:0.4,ease:easeInOut}}
      >
        <img src={filesystemphoto} alt="" 
        className="w-full h-full  object-cover rounded-xl"
        />
      </motion.div>
    </div>
  );
}

export default HomePage;
