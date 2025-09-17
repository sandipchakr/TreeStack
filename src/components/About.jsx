import React from "react";
import { motion } from "framer-motion";

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 md:px-20 py-12 md:py-20 bg-[#020b1a] min-h-screen">
      <motion.div
        className="max-w-3xl text-center space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={childVariants}
          className="text-4xl md:text-5xl font-bold text-green-600"
        >
          About TreeStack
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-lg md:text-xl text-gray-400 leading-relaxed"
        >
          <span className="font-semibold text-green-500">TreeStack</span> is a
          smart video management application that helps you{" "}
          <span className="font-semibold">organize, save, and access</span> your
          favorite videos from platforms like{" "}
          <span className="italic">YouTube, Instagram, Facebook</span> and more.
          Instead of searching through endless tabs, you can neatly store videos
          into custom folders, making it simple to revisit them whenever you
          want.
        </motion.p>

        <motion.p
          variants={childVariants}
          className="text-lg md:text-xl text-gray-400 leading-relaxed"
        >
          With TreeStack, you'll be able to:
        </motion.p>

       <motion.div className="bg-[#021535] p-4 border border-[#5a93cc]"
       variants={childVariants}
       >
         <motion.ul
          variants={childVariants}
          className="text-left text-gray-400 text-base md:text-lg list-disc list-inside space-y-2"
        >
          <li>Save videos with just a link</li>
          <li>Organize them into folders for easy access</li>
          <li>View thumbnails for quick identification</li>
          <li>Manage, edit, or delete your saved videos anytime</li>
        </motion.ul>
       </motion.div>

        <motion.p
          variants={childVariants}
          className="text-lg md:text-xl text-gray-400 leading-relaxed"
        >
          Our goal is to make managing your video library as{" "}
          <span className="font-semibold text-green-500">smooth</span> and{" "}
          <span className="font-semibold text-green-500">efficient</span> as
          possible — so you can focus on what matters most: enjoying the
          content.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default About;
