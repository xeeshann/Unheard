import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import { button as buttonStyles } from "@heroui/theme";
import { Link } from "@heroui/link";

export default function SupportPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-10 max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className={title({ color: "violet" })}>Support Center</h1>
          <p className={subtitle({ class: "mt-3 mx-auto" })}>
            We're here to help you with any questions or concerns.
          </p>
        </motion.div>

        {/* Support Options Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Get Help Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 rounded-xl bg-gradient-to-br from-violet-900/40 to-indigo-900/30 backdrop-blur-sm border border-violet-300/20 dark:border-violet-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-4">Contact Support</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Have a question or need assistance? Our support team is here to help you with any issues you may encounter.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-violet-600 dark:text-violet-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Email Support</p>
                  <p className="text-zinc-800 dark:text-zinc-200">support@unheard.app</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-violet-600 dark:text-violet-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Response Time</p>
                  <p className="text-zinc-800 dark:text-zinc-200">Within 24 hours</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="mailto:support@unheard.app"
                className={buttonStyles({
                  color: "primary",
                  radius: "full",
                  variant: "shadow",
                })}
              >
                Contact Support
              </a>
            </div>
          </motion.div>

          {/* Self-Service Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-900/40 to-cyan-900/30 backdrop-blur-sm border border-blue-300/20 dark:border-blue-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Self-Service Resources</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Find answers to common questions and learn how to get the most out of Unheard with our helpful resources.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/guidelines"
                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
              >
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600 dark:text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Guidelines</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Learn about our community standards</p>
                </div>
              </Link>
              <Link
                href="/about"
                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
              >
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600 dark:text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">About Unheard</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Learn about our mission and values</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Feedback Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-6 rounded-xl bg-gradient-to-br from-pink-900/40 to-rose-900/30 backdrop-blur-sm border border-pink-300/20 dark:border-pink-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4">Share Your Feedback</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Your feedback helps us improve. Let us know what you think about Unheard or suggest new features.
            </p>
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                  "We're constantly evolving based on community feedback. Your input directly shapes our platform."
                </p>
              </div>
              <div className="mt-2">
                <a
                  href="mailto:feedback@unheard.app?subject=Unheard%20Feedback"
                  className={buttonStyles({
                    color: "secondary",
                    radius: "full",
                    variant: "flat",
                  })}
                >
                  Send Feedback
                </a>
              </div>
            </div>
          </motion.div>

          {/* Report Issues Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.5 }}
            className="p-6 rounded-xl bg-gradient-to-br from-amber-900/40 to-orange-900/30 backdrop-blur-sm border border-amber-300/20 dark:border-amber-700/20 shadow-md"
          >
            <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4">Report Issues</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Encounter a technical issue or content that violates our guidelines? Let us know immediately.
            </p>
            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <span className="text-amber-500 dark:text-amber-400 mt-1">•</span>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">For technical issues, please provide details like your device, browser, and steps to reproduce.</p>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-amber-500 dark:text-amber-400 mt-1">•</span>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">For content reports, please include the specific confession or username involved.</p>
              </div>
              <div className="mt-4">
                <a
                  href="mailto:report@unheard.app?subject=Issue%20Report"
                  className={buttonStyles({
                    color: "warning",
                    radius: "full",
                    variant: "flat",
                  })}
                >
                  Report an Issue
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        
      </section>
    </DefaultLayout>
  );
}