import { ID, Query, Permission, Role } from 'appwrite';
import { databases, getOrCreateSession, getAnonymousId } from './config';
import { 
  APPWRITE_DATABASE_ID, 
  APPWRITE_CONFESSION_COLLECTION_ID,
  APPWRITE_REACTION_COLLECTION_ID,
  APPWRITE_COMMENT_COLLECTION_ID
} from './config';
import { Confession, Mood, ReactionType, Tag, Topic } from '@/types/confession';

export class ConfessionService {
  /**
   * Creates a new confession
   */
  async createConfession(
    text: string,
    tags: Tag[],
    username?: string,
    mood?: Mood,
    anonymous: boolean = false,
    topic?: string,
    avatar?: string // Add avatar parameter
  ): Promise<any> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      // Generate user identifiers that preserve anonymity but ensure consistency
      const deviceId = getAnonymousId();
      
      const confession = {
        text,
        tags,
        timestamp: new Date().toISOString(),
        likes: 0,
        username: anonymous ? 'Anonymous' : (username || `User-${deviceId.substring(0, 6)}`),
        mood,
        isHighlighted: false,
        commentsCount: 0,
        anonymous,
        topic,
        deviceId, // Store device ID to allow editing/deletion by original creator
        // Ensure the avatar is saved properly and never becomes undefined
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deviceId}`
      };

      // Create the confession document
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        ID.unique(),
        confession,
        // Use proper permissions that Appwrite accepts
        [
          Permission.read(Role.any()),
          Permission.write(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      return response;
    } catch (error) {
      console.error('Error creating confession:', error);
      throw error;
    }
  }

  /**
   * Gets all confessions with their associated comments and reactions
   */
  async getAllConfessions(): Promise<Confession[]> {
    try {
      // Ensure we have a valid session
      await getOrCreateSession();
      
      // Get all confessions
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        [Query.orderDesc('timestamp')]
      );
      
      // Convert the timestamp strings back to Date objects
      const confessionsBasic = response.documents.map(doc => ({
        ...doc,
        timestamp: new Date(doc.timestamp),
        id: doc.$id,
      })) as unknown as Confession[];
      
      // Fetch comments and reactions for all confessions
      return await this.enrichConfessionsWithData(confessionsBasic);
    } catch (error) {
      console.error('Error getting confessions:', error);
      throw error;
    }
  }

  /**
   * Enriches confession data with comments and reactions
   * @private
   */
  private async enrichConfessionsWithData(confessions: Confession[]): Promise<Confession[]> {
    try {
      // No confessions to process
      if (!confessions.length) return [];
      
      // Load comments and reactions for each confession
      const enrichedConfessions = await Promise.all(
        confessions.map(async (confession) => {
          try {
            // Get comments for this confession
            const comments = await this.getCommentsForConfession(confession.id);
            
            // Get reactions for this confession
            const reactions = await this.getReactionsForConfession(confession.id);
            
            // Calculate total reaction count
            const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
            
            // Mark as highlighted (trending) if total reactions > 30
            const isHighlighted = totalReactions > 30;
            
            // If the highlighted status changed, update it in the database
            if (isHighlighted !== confession.isHighlighted) {
              try {
                await this.updateConfession(confession.id, { isHighlighted });
              } catch (error) {
                console.error(`Error updating highlight status for confession ${confession.id}:`, error);
              }
            }
            
            // Return the confession with comments, reactions and updated highlight status
            return {
              ...confession,
              comments,
              reactions,
              isHighlighted
            };
          } catch (err) {
            console.error(`Error enriching confession ${confession.id}:`, err);
            // If there's an error, return the original confession
            return confession;
          }
        })
      );
      
      return enrichedConfessions;
    } catch (err) {
      console.error('Error enriching confessions:', err);
      // If there's a general error, return the original confessions
      return confessions;
    }
  }
  
  /**
   * Gets comments for a specific confession
   * @private
   */
  private async getCommentsForConfession(confessionId: string) {
    try {
      const commentsResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        [
          Query.equal('confessionId', confessionId),
          Query.orderDesc('timestamp')
        ]
      );
      
      // Convert to proper comment format
      return commentsResponse.documents.map(doc => ({
        id: doc.$id,
        username: doc.username,
        text: doc.text,
        timestamp: new Date(doc.timestamp),
        avatar: doc.avatar
      }));
    } catch (err) {
      console.error(`Error fetching comments for confession ${confessionId}:`, err);
      return [];
    }
  }
  
  /**
   * Gets formatted reactions for a specific confession
   * @private
   */
  private async getReactionsForConfession(confessionId: string) {
    try {
      const { counts, userReactions } = await this.getReactions(confessionId);
      
      // Format as reaction objects for UI
      return Object.keys(counts).map(type => ({
        type: type as ReactionType,
        count: counts[type as ReactionType],
        userHasReacted: userReactions.includes(type as ReactionType)
      }));
    } catch (err) {
      console.error(`Error fetching reactions for confession ${confessionId}:`, err);
      
      // Return default reactions if there's an error
      const reactionTypes: ReactionType[] = ["❤️", "👍", "😂", "😢", "🔥"];
      return reactionTypes.map(type => ({
        type,
        count: 0,
        userHasReacted: false
      }));
    }
  }

  /**
   * Gets a specific confession by ID with its comments and reactions
   */
  async getConfession(id: string): Promise<Confession> {
    try {
      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        id
      );
      
      const basicConfession = {
        ...response,
        timestamp: new Date(response.timestamp),
        id: response.$id,
      } as unknown as Confession;
      
      // Enrich with comments and reactions, just like we do for lists
      const [enrichedConfession] = await this.enrichConfessionsWithData([basicConfession]);
      return enrichedConfession;
    } catch (error) {
      console.error('Error getting confession:', error);
      throw error;
    }
  }

  /**
   * Updates a confession - can only be done by the original creator
   */
  async updateConfession(
    id: string, 
    data: Partial<Omit<Confession, 'id' | 'timestamp'>>
  ): Promise<any> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      return await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        id,
        data
      );
    } catch (error) {
      console.error('Error updating confession:', error);
      throw error;
    }
  }

  /**
   * Deletes a confession - can only be done by the original creator
   */
  async deleteConfession(id: string): Promise<any> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting confession:', error);
      throw error;
    }
  }

  /**
   * Toggles a reaction on a confession with reliable user identity
   */
  async toggleReaction(
    confessionId: string, 
    reactionType: ReactionType
  ): Promise<{ added: boolean, reactionType: ReactionType }> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      // Get the device ID for this user
      const deviceId = getAnonymousId();
      
      // Check if the user has already reacted
      const reactions = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_REACTION_COLLECTION_ID,
        [
          Query.equal('confessionId', confessionId),
          Query.equal('deviceId', deviceId),
          Query.equal('type', reactionType)
        ]
      );
      
      // If the user has already reacted, remove the reaction
      if (reactions.documents.length > 0) {
        await databases.deleteDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_REACTION_COLLECTION_ID,
          reactions.documents[0].$id
        );
        return { added: false, reactionType };
      } 
      // Otherwise, add the reaction
      else {
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_REACTION_COLLECTION_ID,
          ID.unique(),
          {
            confessionId,
            deviceId,
            type: reactionType,
            timestamp: new Date().toISOString()
          },
          [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );
        return { added: true, reactionType };
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      throw error;
    }
  }

  /**
   * Gets reactions for a confession and checks if current user has reacted
   */
  async getReactions(confessionId: string): Promise<{
    counts: Record<ReactionType, number>,
    userReactions: ReactionType[]
  }> {
    try {
      // Get all reactions for this confession
      const reactions = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_REACTION_COLLECTION_ID,
        [Query.equal('confessionId', confessionId)]
      );
      
      // Count reactions by type
      const reactionCounts = {} as Record<ReactionType, number>;
      const reactionTypes: ReactionType[] = ["❤️", "👍", "😂", "😢", "🔥"];
      
      // Initialize all reaction types with 0 count
      reactionTypes.forEach(type => {
        reactionCounts[type] = 0;
      });
      
      // Current user's device ID
      const deviceId = getAnonymousId();
      const userReactions: ReactionType[] = [];
      
      // Count reactions and check for user reactions
      reactions.documents.forEach(reaction => {
        const type = reaction.type as ReactionType;
        if (reactionCounts[type] !== undefined) {
          reactionCounts[type]++;
        }
        
        // Check if this is a reaction by the current user
        if (reaction.deviceId === deviceId) {
          userReactions.push(type);
        }
      });
      
      return {
        counts: reactionCounts,
        userReactions
      };
    } catch (error) {
      console.error('Error getting reactions:', error);
      throw error;
    }
  }

  /**
   * Gets confessions by tag
   */
  async getConfessionsByTag(tag: Tag): Promise<Confession[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        [Query.search('tags', tag)]
      );
      
      const confessionsBasic = response.documents.map(doc => ({
        ...doc,
        timestamp: new Date(doc.timestamp),
        id: doc.$id,
      })) as unknown as Confession[];
      
      // Enrich with comments and reactions
      return await this.enrichConfessionsWithData(confessionsBasic);
    } catch (error) {
      console.error('Error getting confessions by tag:', error);
      throw error;
    }
  }

  /**
   * Gets highlighted confessions
   */
  async getHighlightedConfessions(): Promise<Confession[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        [Query.equal('isHighlighted', true)]
      );
      
      const confessionsBasic = response.documents.map(doc => ({
        ...doc,
        timestamp: new Date(doc.timestamp),
        id: doc.$id,
      })) as unknown as Confession[];
      
      // Enrich with comments and reactions
      return await this.enrichConfessionsWithData(confessionsBasic);
    } catch (error) {
      console.error('Error getting highlighted confessions:', error);
      throw error;
    }
  }

  /**
   * Gets topic statistics based on confessions
   */
  async getTopicStatistics(): Promise<Topic[]> {
    try {
      // Get all confessions
      const confessions = await this.getAllConfessions();
      
      // Count topics
      const topicCounts: Record<string, { count: number, icon: string }> = {};
      
      // Map of icons for different topics
      const topicIcons: Record<string, string> = {
        "Mental Health": "🧠",
        "Relationships": "❤️",
        "Career Struggles": "💼",
        "Academic Pressure": "📚",
        "Family Issues": "👨‍👩‍👧‍👦",
        "Identity & Self": "🪞",
        "Life Goals": "🎯",
        "Social Anxiety": "😰",
        "Personal Growth": "🌱",
        "Dreams & Aspirations": "💭",
        "Health & Wellness": "🏋️‍♂️",
        "Travel & Adventure": "✈️",
        "Hobbies & Interests": "🎨",
        // Default icon for any other topics
        "Other": "📝"
      };
      
      // Count confessions by topic
      confessions.forEach(confession => {
        if (confession.topic) {
          if (!topicCounts[confession.topic]) {
            topicCounts[confession.topic] = { 
              count: 0, 
              icon: topicIcons[confession.topic] || topicIcons["Other"]
            };
          }
          topicCounts[confession.topic].count++;
        }
      });
      
      // Convert to Topic array and sort by count (descending)
      const topics: Topic[] = Object.entries(topicCounts).map(([name, data]) => ({
        name,
        icon: data.icon,
        count: data.count
      }));
      
      return topics.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting topic statistics:', error);
      return [];
    }
  }
  
  /**
   * Gets confessions by topic
   */
  async getConfessionsByTopic(topic: string): Promise<Confession[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        [Query.equal('topic', topic)]
      );
      
      const confessionsBasic = response.documents.map(doc => ({
        ...doc,
        timestamp: new Date(doc.timestamp),
        id: doc.$id,
      })) as unknown as Confession[];
      
      // Enrich with comments and reactions
      return await this.enrichConfessionsWithData(confessionsBasic);
    } catch (error) {
      console.error('Error getting confessions by topic:', error);
      throw error;
    }
  }
}