import { web } from './config/web.js';
import { logger } from './config/logging.js';
import { initializeDatabase } from './config/database.js';

web.listen(3000, async () => {
    await initializeDatabase();
    logger.info(`Server running on port 3000`);
})