import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-10 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className={title({ color: "violet" })}>About Unheard</h1>
          <p className={subtitle({ class: "mt-3" })}>
            A safe space for sharing what's on your mind.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-violet-600 dark:text-violet-400">Our Mission</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Unheard was created with a simple goal: to provide a safe, anonymous space for people to share their 
              thoughts, confessions, and experiences without judgment. We believe that sometimes the most cathartic 
              thing can be simply letting your thoughts out into the world, even if nobody knows it came from you.
            </p>
          </div>

          <div className="rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-violet-600 dark:text-violet-400">How It Works</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              Unheard allows you to anonymously submit confessions or thoughts that you want to share with the world. 
              No account is needed - just write, tag, and submit. Your confession joins our feed where others can read it, 
              but nobody will know it came from you.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              We use tags to help organize confessions and allow readers to find content they can relate to. 
              Whether it's about love, anxiety, dreams, or failures, there's a place for your words here.
            </p>
          </div>

          <div className="rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-violet-600 dark:text-violet-400">Community Guidelines</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              While Unheard provides anonymity, we also maintain a respectful environment. We do not tolerate:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>Hate speech or discrimination</li>
              <li>Targeted harassment of individuals</li>
              <li>Content that promotes harm or illegal activities</li>
              <li>Sharing of personal identifiable information</li>
            </ul>
          </div>
          
          <div className="rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-violet-600 dark:text-violet-400">Our Technology</h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Unheard is built with modern web technologies focusing on performance and privacy. We use Appwrite 
              as our backend service, which allows us to maintain anonymity while still providing essential functionality. 
              Your data is protected, and we never collect personal information that could identify you.
            </p>
          </div>
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
