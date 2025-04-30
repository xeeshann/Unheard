import { ID, Query, Permission, Role } from 'appwrite';
import { databases, getOrCreateSession, getAnonymousId } from './config';
import { 
  APPWRITE_DATABASE_ID, 
  APPWRITE_COMMENT_COLLECTION_ID,
  APPWRITE_CONFESSION_COLLECTION_ID
} from './config';
import { Comment } from '@/types/confession';

export class CommentService {
  /**
   * Adds a comment to a confession
   */
  async addComment(
    confessionId: string,
    text: string,
    username: string = 'Anonymous',
    avatar?: string
  ): Promise<Comment> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      // Get the unique device ID for this user
      const deviceId = getAnonymousId();
      
      // Create the comment document
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        ID.unique(),
        {
          confessionId,
          text,
          username: username || 'Anonymous User-' + deviceId.substring(0, 6),
          timestamp: new Date().toISOString(),
          deviceId, // Store device ID to allow editing/deletion by original creator
          avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deviceId}`
        },
        // Use proper permissions that Appwrite accepts
        [
          Permission.read(Role.any()),
          Permission.write(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      
      // After successful comment creation, increment the comment count
      await this.incrementCommentsCount(confessionId);
      
      return {
        ...response,
        id: response.$id,
        username: response.username,
        text: response.text,
        timestamp: new Date(response.timestamp)
      } as Comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
  
  /**
   * Gets all comments for a confession 
   */
  async getComments(confessionId: string): Promise<Comment[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        [
          Query.equal('confessionId', confessionId),
          Query.orderDesc('timestamp')
        ]
      );
      
      // Convert the timestamp strings back to Date objects
      const comments = response.documents.map(doc => ({
        ...doc,
        id: doc.$id,
        username: doc.username,
        text: doc.text,
        timestamp: new Date(doc.timestamp),
        avatar: doc.avatar // Make sure we're including the avatar
      })) as Comment[];
      
      return comments;
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }
  
  /**
   * Deletes a comment
   */
  async deleteComment(commentId: string, confessionId: string): Promise<object> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      // Get the unique device ID for this user
      const deviceId = getAnonymousId();
      
      // First check if the comment exists and belongs to this user
      const comment = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        commentId
      );
      
      // Verify ownership
      if (comment.deviceId !== deviceId) {
        throw new Error('You can only delete your own comments');
      }
      
      const response = await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        commentId
      );
      
      // Decrement the comments count on the confession
      await this.decrementCommentsCount(confessionId);
      
      return response;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
  
  /**
   * Updates comment count on confession
   * @private
   */
  private async incrementCommentsCount(confessionId: string): Promise<object> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      try {
        // First get the current confession
        const confession = await databases.getDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONFESSION_COLLECTION_ID,
          confessionId
        );
        
        // Increment the comments count
        const currentCount = confession.commentsCount || 0;
        
        return await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONFESSION_COLLECTION_ID,
          confessionId,
          {
            commentsCount: currentCount + 1
          }
        );
      } catch (innerError: any) {
        // If we get a permissions error when updating the comment count
        // Still return success - the comment was created, even if we couldn't update the count
        console.log("Note: Comment created but couldn't update comment count due to permissions");
        
        // Return an empty object to maintain the expected return type
        return {};
      }
    } catch (error) {
      console.error('Error incrementing comments count:', error);
      // Don't throw the error - this is a non-critical operation
      // The comment still got created successfully
      return {};
    }
  }
  
  /**
   * Decrements comment count on confession
   * @private
   */
  private async decrementCommentsCount(confessionId: string): Promise<object> {
    try {
      // Ensure authenticated session exists
      await getOrCreateSession();
      
      try {
        // First get the current confession
        const confession = await databases.getDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONFESSION_COLLECTION_ID,
          confessionId
        );
        
        // Decrement the comments count, but don't go below 0
        const currentCount = confession.commentsCount || 0;
        const newCount = Math.max(0, currentCount - 1);
        
        return await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_CONFESSION_COLLECTION_ID,
          confessionId,
          {
            commentsCount: newCount
          }
        );
      } catch (innerError: any) {
        // If we get a permissions error when updating the comment count
        // Still return success - the comment was deleted, even if we couldn't update the count
        console.log("Note: Comment deleted but couldn't update comment count due to permissions");
        
        // Return an empty object to maintain the expected return type
        return {};
      }
    } catch (error) {
      console.error('Error decrementing comments count:', error);
      // Don't throw the error - this is a non-critical operation
      // The comment was still deleted successfully
      return {};
    }
  }
}