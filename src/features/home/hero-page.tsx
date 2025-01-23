"use client";

import { motion } from "framer-motion";

export default function HeroPage() {
  return (
    <div
      id="hero-container"
      className="min-h-screen flex flex-col min-w-full items-center justify-center bg-background/95 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        id="gradient-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full min-w-full h-full bg-gradient-to-br from-pink-500/20 via-transparent to-purple-500/20"
      />

      <div
        id="content-wrapper"
        className="relative z-10 text-center space-y-6 max-w-full px-4"
      >
        <motion.div
          id="title-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-geist font-bold tracking-tight">
            <motion.span
              id="animated-title"
              className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
              Welcome to Blogs
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          id="subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl text-muted-foreground font-roboto leading-relaxed max-w-2xl mx-auto"
        >
          Explore the world of development through insightful articles,
          tutorials, and stories from passionate developers around the globe.
        </motion.p>

        <motion.div
          id="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <motion.button
            id="primary-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold transition-all duration-300"
          >
            Start Reading
          </motion.button>
          <motion.button
            id="secondary-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 rounded-lg border border-pink-500 text-pink-500 font-semibold hover:bg-pink-500/10 transition-all duration-300"
          >
            Join Community
          </motion.button>
        </motion.div>

        <motion.div
          id="stats-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex items-center justify-center gap-4 sm:gap-8 text-muted-foreground"
        >
          {[
            { number: "500+", label: "Articles" },
            { number: "10K+", label: "Readers" },
            { number: "100+", label: "Authors" },
          ].map((item, index) => (
            <motion.div
              key={index}
              id={`stat-item-${index}`}
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
              >
                {item.number}
              </motion.div>
              <div className="text-xs sm:text-sm">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        id="bottom-fade"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"
      />
      <motion.div
        id="top-right-glow"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-[100px]"
      />
      <motion.div
        id="bottom-left-glow"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          delay: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-[100px]"
      />
    </div>
  );
}
