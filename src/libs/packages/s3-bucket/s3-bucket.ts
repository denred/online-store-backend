import { config } from '../config/config.js';
import { logger } from '../logger/logger.js';
import { S3Bucket } from './s3-bucket.package.js';

const s3Bucket = new S3Bucket({ config, logger });

export { s3Bucket };
