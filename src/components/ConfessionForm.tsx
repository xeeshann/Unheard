import { useState, useEffect } from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Tooltip } from "@nextui-org/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Mood, Tag, ReactionType, Topic } from "@/types/confession";
import { Avatar } from "@nextui-org/avatar";
import { Select, SelectItem } from "@nextui-org/select";

interface ConfessionFormProps {
  onSubmit: (confessionData: {
    text: string;
    tags: Tag[];
    mood: Mood | null;
    username: string;
    avatar?: string;
    initialReaction?: ReactionType | null;
    topic: string; // Changed from optional to required
  }) => void;
  featuredTopics: Topic[];
}

export const ConfessionForm = ({ onSubmit, featuredTopics: _ }: ConfessionFormProps) => {
  const [confession, setConfession] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [initialReaction, setInitialReaction] = useState<ReactionType | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [topicError, setTopicError] = useState("");

  // Track screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load saved username and avatar from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("confessionUsername");
    const savedAvatar = localStorage.getItem("confessionAvatar");
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  // Predefined avatar options
  const avatarOptions = [
    { id: "avatar1", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1", label: "Avatar 1" },
    { id: "avatar2", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2", label: "Avatar 2" },
    { id: "avatar3", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3", label: "Avatar 3" },
    { id: "avatar4", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4", label: "Avatar 4" },
    { id: "avatar5", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5", label: "Avatar 5" },
    { id: "avatar6", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6", label: "Avatar 6" },
    { id: "avatar7", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar7", label: "Avatar 7" },
    { id: "avatar8", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar8", label: "Avatar 8" },
    { id: "avatar9", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar9", label: "Avatar 9" },
  ];

  const handleSubmit = () => {
    // Validate username
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    }
    
    // Validate topic
    if (!selectedTopic) {
      setTopicError("Please select a topic");
      return false;
    }
    
    // Check confession length
    if (confession.trim().split(" ").length < 10) {
      return false; // Not enough words
    }
    
    // Get avatar URL - either selected or from localStorage
    let avatarUrl = selectedAvatar;
    if (!avatarUrl) {
      const savedAvatar = localStorage.getItem("confessionAvatar");
      if (savedAvatar) {
        avatarUrl = savedAvatar;
      }
    }
    
    onSubmit({
      text: confession,
      tags: selectedTags,
      mood: selectedMood,
      username,
      avatar: avatarUrl,
      initialReaction,
      topic: selectedTopic, // Now required
    });
    
    // Save username to localStorage
    localStorage.setItem("confessionUsername", username);
    if (selectedAvatar) {
      localStorage.setItem("confessionAvatar", selectedAvatar);
    }
    
    // Reset form
    setConfession("");
    setSelectedTags([]);
    setSelectedMood(null);
    setUsername("");
    setSelectedAvatar("");
    setInitialReaction(null);
    setUsernameError("");
    setSelectedTopic("");
    setTopicError("");
    
    return true;
  };
  
  const toggleTag = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const availableTags: Tag[] = [
    "#anxiety", "#study", "#love", "#failure", "#dreams", 
    "#motivation", "#relationship", "#career", "#family", "#health"
  ];
  
  const moods: Mood[] = ["happy", "sad", "neutral", "angry", "inspired", "confused"];

  // Icons for different moods
  const MoodIcons = {
    happy: "😊",
    sad: "😔",
    neutral: "😐",
    angry: "😠",
    inspired: "✨",
    confused: "😕"
  };

  // Available reaction types
  const reactionTypes: ReactionType[] = ["❤️", "👍", "😂", "😢", "🔥"];
  
  // Reaction descriptions
  const reactionDescriptions: Record<ReactionType, string> = {
    "❤️": "Love this",
    "👍": "Approve",
    "😂": "Laugh",
    "😢": "Sad",
    "🔥": "Fire"
  };

  // Animation for reactions panel
  const reactionsAnimation = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 10 },
    transition: { type: "spring", stiffness: 500, damping: 30 }
  };

  return (
    <motion.div 
      id="confess"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card w-full p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Share Your Confession, Thought, or Feeling.
      </h2>
      
      {/* Username field - required */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          Username (choose any username you want) <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (e.target.value.trim()) {
              setUsernameError("");
            }
          }}
          placeholder="Enter your username"
          className={`glass-input w-full rounded-lg p-2 border-none focus:ring-2 focus:ring-primary ${
            usernameError ? 'ring-2 ring-red-500' : ''
          }`}
          required
        />
        {usernameError && (
          <p className="mt-1 text-xs text-red-500">{usernameError}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="confession" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          Your Confession, Thought or Feeling. <span className="text-red-500">*</span>
        </label>
        <textarea
          id="confession"
          className="glass-input w-full rounded-lg p-4 border-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
          placeholder="Let it all out... (min 10 words)"
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          required
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>{confession.trim().split(/\s+/).length} words (minimum 10)</span>
          <span>{200 - confession.length} characters remaining</span>
        </div>
      </div>
      
      {/* Topic selection dropdown - now required */}
      <div className="mb-4">
        <label htmlFor="topic" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          Select a topic <span className="text-red-500">*</span>
        </label>
        <Select
          id="topic"
          placeholder="Choose a topic"
          selectedKeys={selectedTopic ? [selectedTopic] : []}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setTopicError("");
          }}
          className={`glass-input w-full rounded-lg border-none focus:ring-2 focus:ring-primary ${
            topicError ? 'ring-2 ring-red-500' : ''
          }`}
          classNames={{
            trigger: "bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md",
            value: "text-zinc-800 dark:text-zinc-200",
          }}
          isRequired
        >
          {/* Always show the full list of topics, regardless of featuredTopics length */}
          {[
            { name: "Mental Health", icon: "🧠" },
            { name: "Relationships", icon: "❤️" },
            { name: "Career Struggles", icon: "💼" },
            { name: "Academic Pressure", icon: "📚" },
            { name: "Family Issues", icon: "👨‍👩‍👧‍👦" },
            { name: "Identity & Self", icon: "🪞" },
            { name: "Life Goals", icon: "🎯" },
            { name: "Social Anxiety", icon: "😰" },
            { name: "Personal Growth", icon: "🌱" },
            { name: "Dreams & Aspirations", icon: "💭" },
            { name: "Health & Wellness", icon: "🏋️‍♂️" },
            { name: "Travel & Adventure", icon: "✈️" },
            { name: "Hobbies & Interests", icon: "🎨" },
            { name: "Other", icon: "📝" }
          ].map((topic) => (
            <SelectItem key={topic.name} value={topic.name} textValue={topic.name}>
              <div className="flex items-center gap-2">
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </div>
            </SelectItem>
          ))}
        </Select>
        {topicError && (
          <p className="mt-1 text-xs text-red-500">{topicError}</p>
        )}
      </div>
      
      {/* Avatar selection */}
      <div className="mb-4">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Choose an avatar:</p>
        <div className="flex flex-wrap gap-3">
          {avatarOptions.map((avatar) => (
            <Tooltip key={avatar.id} content={avatar.label}>
              <button
                onClick={() => {
                  const newAvatar = selectedAvatar === avatar.src ? "" : avatar.src;
                  setSelectedAvatar(newAvatar);
                  localStorage.setItem("confessionAvatar", newAvatar);
                }}
                className={`p-1 rounded-full transition-all ${
                  selectedAvatar === avatar.src 
                    ? 'ring-2 ring-primary transform scale-110' 
                    : 'opacity-70'
                }`}
              >
                <Avatar src={avatar.src} size="md" />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mr-2 self-center">Tags:</span>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-primary/80 backdrop-blur-md text-white'
                : 'glass-button'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">How are you feeling?</p>
        <div className="flex flex-wrap gap-3">
          {moods.map(mood => (
            <Tooltip key={mood} content={mood.charAt(0).toUpperCase() + mood.slice(1)}>
              <button
                onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                className={`p-2 rounded-lg text-2xl transition-all ${
                  selectedMood === mood 
                    ? 'bg-primary/20 transform scale-110' 
                    : 'glass-button opacity-70'
                }`}
              >
                {MoodIcons[mood]}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Initial Reaction - new addition */}
      <div className="mb-4 relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Add your initial reaction:</p>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-sm text-primary hover:underline"
          >
            {showEmojiPicker ? "Hide reactions" : initialReaction ? "Change reaction" : "Add reaction"}
          </button>
        </div>
        
        {initialReaction ? (
          <div className="flex items-center gap-2 mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInitialReaction(null)}
              className="p-2 rounded-full bg-primary/10 text-2xl hover:bg-primary/20 transition-all"
            >
              {initialReaction}
            </motion.button>
            <span className="text-sm">{reactionDescriptions[initialReaction]}</span>
          </div>
        ) : (
          <p className="italic text-sm text-zinc-500 mb-2">
            {showEmojiPicker ? "Select a reaction below:" : "No reaction selected"}
          </p>
        )}
        
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-8'} gap-2 p-3 rounded-xl 
                          border border-zinc-200/30 dark:border-zinc-700/30 
                          bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md shadow-lg`}
              {...reactionsAnimation}
            >
              {reactionTypes.map(type => (
                <Tooltip key={type} content={reactionDescriptions[type]}>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setInitialReaction(initialReaction === type ? null : type);
                      setShowEmojiPicker(false);
                    }}
                    className={`text-2xl p-2 rounded-full transition-all ${
                      initialReaction === type 
                        ? 'bg-primary/20 transform scale-110 border border-primary/30' 
                        : 'hover:bg-white/40 dark:hover:bg-zinc-700/40'
                    }`}
                  >
                    {type}
                  </motion.button>
                </Tooltip>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <button
            onClick={handleSubmit}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              fullWidth: true
            }) + " bg-primary/80 backdrop-blur-md hover:bg-primary/90 shadow-primary/20"}
          >
            Share Your Confession
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};