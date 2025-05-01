// Types for our confession system
export type Tag = "#anxiety" | "#study" | "#love" | "#failure" | "#dreams" | "#motivation" | "#relationship" | "#career" | "#family" | "#health";
export type Mood = "happy" | "sad" | "neutral" | "angry" | "inspired" | "confused";

// Define reaction types for confessions
export type ReactionType = "❤️" | "👍" | "😂" | "😢" | "🔥" ;

export interface Reaction {
  type: ReactionType;
  count: number;
  userHasReacted: boolean;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  avatar?: string;
}

export interface Confession {
  id: string;
  text: string;
  tags: Tag[];
  timestamp: Date;
  likes: number;
  username?: string; 
  mood?: Mood;
  isHighlighted?: boolean;
  comments?: Comment[];  // Now storing actual comment objects
  commentsCount?: number;
  userHasLiked?: boolean;
  anonymous?: boolean;
  reactions?: Reaction[];  // Array of different reaction types
  avatar?: string;
  topic?: string;  // Added topic field
}

// Icons for different moods
export const MoodIcons = {
  happy: "😊",
  sad: "😔",
  neutral: "😐",
  angry: "😠",
  inspired: "✨",
  confused: "😕"
};

// Topic interface
export interface Topic {
  name: string;
  icon: string;
  count: number;
}

// Default avatar - used when avatar is invalid or not available
export const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

// List of valid avatar styles used in the app
export const VALID_AVATAR_STYLES = [
  "avataaars", "pixel-art", "identicon", "bottts", "micah"
];

// Function to validate avatar URLs
export function validateAvatar(avatarUrl?: string): string {
  if (!avatarUrl) return DEFAULT_AVATAR;
  
  // Check if it's from DiceBear
  if (avatarUrl.startsWith("https://api.dicebear.com/7.x/")) {
    // Make sure it's using one of our approved styles
    const isValidStyle = VALID_AVATAR_STYLES.some(style => avatarUrl.includes(`/${style}/`));
    return isValidStyle ? avatarUrl : DEFAULT_AVATAR;
  }
  
  // If not a DiceBear URL, use default
  return DEFAULT_AVATAR;
}

// Helper functions
export const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};