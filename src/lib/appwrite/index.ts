import { ConfessionService } from './confessionService';
import { CommentService } from './commentService';
import { migrateExistingRecords } from './migration';

// Export services
export const confessionService = new ConfessionService();
export const commentService = new CommentService();

// Export migration function
export { migrateExistingRecords };

// Re-export config
export * from './config';