import { mailer } from '~/libs/packages/mailer/mailer.js';

import { MailService } from './mail.service.js';

const mailService = new MailService(mailer);

export { mailService };
