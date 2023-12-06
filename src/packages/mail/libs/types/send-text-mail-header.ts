import { type Options } from 'nodemailer/lib/mailer';

import { type RequireProperty } from '~/libs/types/types.js';

type SendTextMailHeader = RequireProperty<
  Pick<Options, 'to' | 'subject' | 'cc' | 'bcc' | 'text'>,
  'to' | 'subject' | 'text'
>;

export { type SendTextMailHeader };
