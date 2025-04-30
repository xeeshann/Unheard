import { databases, getOrCreateSession } from './config';
import { 
  APPWRITE_DATABASE_ID, 
  APPWRITE_CONFESSION_COLLECTION_ID,
  APPWRITE_COMMENT_COLLECTION_ID,
  APPWRITE_REACTION_COLLECTION_ID
} from './config';
import { ID, Query } from 'appwrite';

/**
 * Migration script to add deviceId to existing records
 * Run this once after adding the deviceId field to your collections
 */
export async function migrateExistingRecords() {
  try {
    // Ensure we have a valid session
    await getOrCreateSession();
    
    // Generate a special deviceId for legacy records
    const legacyDeviceId = 'legacy-' + ID.unique();
    
    // 1. Migrate Confession Collection
    const confessions = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_CONFESSION_COLLECTION_ID,
      [Query.isNull('deviceId')]
    );
    
    let migratedConfessions = 0;
    for (const confession of confessions.documents) {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_CONFESSION_COLLECTION_ID,
        confession.$id,
        { deviceId: legacyDeviceId }
      );
      migratedConfessions++;
    }
    
    // 2. Migrate Comment Collection
    const comments = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COMMENT_COLLECTION_ID,
      [Query.isNull('deviceId')]
    );
    
    let migratedComments = 0;
    for (const comment of comments.documents) {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COMMENT_COLLECTION_ID,
        comment.$id,
        { deviceId: legacyDeviceId }
      );
      migratedComments++;
    }
    
    // 3. Migrate Reaction Collection
    const reactions = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_REACTION_COLLECTION_ID,
      [Query.isNull('deviceId')]
    );
    
    let migratedReactions = 0;
    for (const reaction of reactions.documents) {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_REACTION_COLLECTION_ID,
        reaction.$id,
        { deviceId: legacyDeviceId }
      );
      migratedReactions++;
    }
    
    console.log(`Migration completed successfully:
      - Confessions migrated: ${migratedConfessions}
      - Comments migrated: ${migratedComments}
      - Reactions migrated: ${migratedReactions}
    `);
    
    return {
      success: true,
      confessionsMigrated: migratedConfessions,
      commentsMigrated: migratedComments,
      reactionsMigrated: migratedReactions
    };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}