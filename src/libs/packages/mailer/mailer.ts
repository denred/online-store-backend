import { config } from '../config/config.js';
import { logger } from '../logger/logger.js';
import { MailerMessage } from './libs/enums/enums.js';
import { Mailer } from './mailer.package.js';

const mailer = new Mailer({ logger, config });

try {
  await mailer.connect();
  logger.info(MailerMessage.SMTP_CONNECTION_SUCCESS);
} catch (error) {
  logger.error(MailerMessage.SMTP_CONNECTION_STARTUP_ERROR);
  logger.error(JSON.stringify(error));
}

export { mailer };
export { type Mailer } from './mailer.package.js';
