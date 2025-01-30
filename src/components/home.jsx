import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './icons';
import { VoiceCommands } from './voice-commands';

const features = [
  {
    title: 'Voice Navigation',
    description: 'Control your browser with natural voice commands',
    icon: 'microphone',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Smart Organization',
    description: 'Automatically organize your downloads and bookmarks',
    icon: 'folder',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Quick Actions',
    description: 'Perform common tasks with simple voice commands',
    icon: 'keyboard',
    color: 'bg-yellow-500/10 text-yellow-500',
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const iconAnimation = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: { 
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export function Home() {
  return (
    <div className="w-full min-h-full p-4 sm:p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-8 sm:space-y-12"
      >
        {/* Hero Section */}
        <motion.div 
          variants={item}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Icon name="microphone" className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            WebSpoon
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto">
            Your intelligent browser assistant that makes web navigation effortless
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          className="grid gap-6 sm:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent to-background/5 group-hover:to-background/10 transition-all duration-300" />
              <div className="relative p-6 rounded-lg border bg-card">
                <motion.div
                  variants={iconAnimation}
                  whileHover="hover"
                  className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon name={feature.icon} className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo Section */}
        <motion.div
          variants={item}
          className="relative rounded-lg border bg-card p-6 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Try it out!</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-[500px] mx-auto">
                Just say "Hey WebSpoon" followed by your command. For example:
                "Hey WebSpoon, open new tab" or "Hey WebSpoon, save this page"
              </p>
            </div>
            
            <VoiceCommands />
          </div>
          
          {/* Animated Background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20"
          />
        </motion.div>

        {/* Quick Start */}
        <motion.div
          variants={container}
          className="grid gap-4 sm:grid-cols-2"
        >
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-500/10 p-2">
                <Icon name="doc" className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Read Documentation</h3>
                <p className="text-sm text-muted-foreground">Learn all available commands</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-500/10 p-2">
                <Icon name="settings" className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Customize Settings</h3>
                <p className="text-sm text-muted-foreground">Configure your preferences</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
