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