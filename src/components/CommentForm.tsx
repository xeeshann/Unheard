import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/avatar";
import { Tooltip } from "@nextui-org/tooltip";

interface CommentFormProps {
  onAddComment: (text: string, username: string, avatar?: string) => void;
}

export const CommentForm = ({ onAddComment }: CommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const [commentUsername, setCommentUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  
  // Predefined avatar options (same as in ConfessionForm for consistency)
  const avatarOptions = [
    { id: "avatar1", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1", label: "Avatar 1" },
    { id: "avatar2", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2", label: "Avatar 2" },
    { id: "avatar3", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3", label: "Avatar 3" },
    { id: "avatar4", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4", label: "Avatar 4" },
    { id: "avatar5", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5", label: "Avatar 5" },
    { id: "avatar6", src: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6", label: "Avatar 6" },
  ];
  
  // Load saved username and avatar from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("commentUsername");
    const savedAvatar = localStorage.getItem("commentAvatar");
    
    if (savedUsername) {
      setCommentUsername(savedUsername);
    }
    
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    const username = commentUsername || "Anonymous";
    
    // Save username and avatar to localStorage for future use
    localStorage.setItem("commentUsername", username);
    if (selectedAvatar) {
      localStorage.setItem("commentAvatar", selectedAvatar);
    }
    
    // Call onAddComment with the avatar
    try {
      onAddComment(commentText, username, selectedAvatar);
      // Clear comment text after successful submission
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center mb-2">
        <div className="relative">
          <Avatar 
            size="sm" 
            src={selectedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
            className="mr-2 cursor-pointer"
            onClick={() => setShowAvatarSelection(!showAvatarSelection)}
          />
          {!selectedAvatar && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-xs">
              +
            </div>
          )}
        </div>
        <input 
          type="text" 
          placeholder="Your username (optional)" 
          value={commentUsername}
          onChange={e => setCommentUsername(e.target.value)}
          className="w-full p-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50 border-none text-sm focus:ring-1 focus:ring-primary"
          aria-label="Your username (optional)"
        />
      </div>
      
      {/* Avatar selection popup */}
      {showAvatarSelection && (
        <div className="mb-3 p-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50">
          <p className="text-sm font-medium mb-2">Choose your avatar:</p>
          <div className="flex flex-wrap gap-2">
            {avatarOptions.map((avatar) => (
              <Tooltip key={avatar.id} content={avatar.label}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(avatar.src);
                    setShowAvatarSelection(false);
                  }}
                  className={`p-1 rounded-full transition-all ${
                    selectedAvatar === avatar.src 
                      ? 'ring-2 ring-primary transform scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Avatar src={avatar.src} size="sm" />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2 w-full">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50 text-sm border-none focus:ring-1 focus:ring-primary"
          aria-label="Add a comment"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!commentText.trim()}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </motion.button>
      </div>
    </form>
  );
};