import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import { useState } from "react";
import { button as buttonStyles } from "@heroui/theme";

export default function GuidelinesPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-10 max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className={title({ color: "violet" })}>Community Guidelines</h1>
          <p className={subtitle({ class: "mt-3 mx-auto" })}>
            Our commitment to creating a safe, supportive space for everyone.
          </p>
        </motion.div>

        {/* Bento Grid Layout for Guidelines */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Core Values - Grid Span 3 for emphasis */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-3 p-6 rounded-xl bg-gradient-to-br from-violet-900/40 to-indigo-900/30 backdrop-blur-sm border border-violet-300/20 dark:border-violet-700/20 shadow-md"
          >
            <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-4">Our Core Values</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              Unheard was built on the principle that everyone deserves a safe space to express themselves without 
              judgment. Our community is founded on compassion, respect, and authenticity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-violet-500 dark:text-violet-300 mb-2">Anonymity</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">We protect your identity so you can share honestly.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-pink-500 dark:text-pink-300 mb-2">Respect</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">We honor everyone's experiences without judgment.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-300 mb-2">Community</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">We're all in this together, supporting one another.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Do's Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 p-6 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/20 backdrop-blur-sm border border-green-300/20 dark:border-green-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">What We Encourage</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">Share authentic experiences and feelings</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">Use appropriate tags to help others find relatable content</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">Support others with compassion and understanding</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">Express yourself in ways that feel meaningful to you</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-zinc-700 dark:text-zinc-300">Remember that vulnerability creates connection</p>
              </li>
            </ul>
          </motion.div>
          
          {/* Don'ts Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 p-6 rounded-xl bg-gradient-to-br from-red-900/30 to-pink-900/20 backdrop-blur-sm border border-red-300/20 dark:border-red-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">What's Not Allowed</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <p className="text-zinc-700 dark:text-zinc-300">Hate speech or discrimination</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <p className="text-zinc-700 dark:text-zinc-300">Targeted harassment</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <p className="text-zinc-700 dark:text-zinc-300">Sharing others' personal information</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <p className="text-zinc-700 dark:text-zinc-300">Spam or promotional content</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✕</span>
                <p className="text-zinc-700 dark:text-zinc-300">Illegal activity or threats</p>
              </li>
            </ul>
          </motion.div>
          
          {/* Privacy Commitment */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-sky-900/20 backdrop-blur-sm border border-blue-300/20 dark:border-blue-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Privacy Commitment</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              We never collect personal information that could identify you. Your confessions remain anonymous, and we 
              use secure technology to protect your privacy.
            </p>
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mt-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                "Privacy isn't just a feature, it's fundamental to our platform's purpose."
              </p>
            </div>
          </motion.div>
          
          {/* Safe Space */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 p-6 rounded-xl bg-gradient-to-br from-amber-900/30 to-yellow-900/20 backdrop-blur-sm border border-amber-300/20 dark:border-amber-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4">Creating a Safe Space</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              Our moderation team works to ensure Unheard remains a supportive environment. We review reported content 
              and take action when necessary.
            </p>
            <button 
              className={buttonStyles({
                color: "warning",
                radius: "full",
                variant: "flat",
                size: "sm"
              })}
            >
              Report Content
            </button>
          </motion.div>
          
          
        </motion.div>
        
        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-3xl mx-auto mt-8"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${selectedSection === 'report' ? 'bg-zinc-100 dark:bg-zinc-800 border-violet-300 dark:border-violet-700' : 'bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800'} transition-all duration-300`}>
              <button 
                className="flex justify-between items-center w-full text-left"
                onClick={() => setSelectedSection(selectedSection === 'report' ? null : 'report')}
              >
                <h3 className="text-lg font-medium">How do I report inappropriate content?</h3>
                <span>{selectedSection === 'report' ? '−' : '+'}</span>
              </button>
              
              {selectedSection === 'report' && (
                <div className="mt-4 pl-2 text-zinc-700 dark:text-zinc-300">
                  <p>You can report content by mailing us with content. Our moderation team will review it promptly and take appropriate action if it violates our guidelines.</p>
                </div>
              )}
            </div>
            
            <div className={`p-4 rounded-xl border ${selectedSection === 'account' ? 'bg-zinc-100 dark:bg-zinc-800 border-violet-300 dark:border-violet-700' : 'bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800'} transition-all duration-300`}>
              <button 
                className="flex justify-between items-center w-full text-left"
                onClick={() => setSelectedSection(selectedSection === 'account' ? null : 'account')}
              >
                <h3 className="text-lg font-medium">Do I need an account to use Unheard?</h3>
                <span>{selectedSection === 'account' ? '−' : '+'}</span>
              </button>
              
              {selectedSection === 'account' && (
                <div className="mt-4 pl-2 text-zinc-700 dark:text-zinc-300">
                  <p>No, Unheard is designed to be used without an account to preserve your anonymity. You can share confessions and browse others' content without creating an account or providing any personal information.</p>
                </div>
              )}
            </div>


            
            <div className={`p-4 rounded-xl border ${selectedSection === 'tracking' ? 'bg-zinc-100 dark:bg-zinc-800 border-violet-300 dark:border-violet-700' : 'bg-white/5 backdrop-blur-sm border-zinc-200 dark:border-zinc-800'} transition-all duration-300`}>
              <button 
                className="flex justify-between items-center w-full text-left"
                onClick={() => setSelectedSection(selectedSection === 'tracking' ? null : 'tracking')}
              >
                <h3 className="text-lg font-medium">Does Unheard track my activity?</h3>
                <span>{selectedSection === 'tracking' ? '−' : '+'}</span>
              </button>
              
              {selectedSection === 'tracking' && (
                <div className="mt-4 pl-2 text-zinc-700 dark:text-zinc-300">
                  <p>Unheard collects minimal data necessary for the platform to function. We do not track your identity, browsing history, or link your confessions to any identifiable information. We use anonymous analytics solely to improve the platform experience.</p>
                </div>
              )}
            </div>

            
          </div>
        </motion.div>
        
        {/* Community Pledge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-violet-900/20 backdrop-blur-sm border border-purple-300/20 dark:border-purple-700/20 shadow-md"
        >
          <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">Our Community Pledge</h2>
          <p className="text-zinc-700 dark:text-zinc-300 italic">
            "We pledge to maintain a space where every voice can be heard without fear or judgment. Where your 
            thoughts matter, your experiences are valued, and your privacy is protected. Together, we're building 
            a community where authenticity thrives."
          </p>
        </motion.div>
      </section>
    </DefaultLayout>
  );
}