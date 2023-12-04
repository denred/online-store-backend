import { type Options } from 'nodemailer/lib/mailer';

import { type RequireProperty } from '~/libs/types/types.js';

type SendPageMailHeader = RequireProperty<
  Pick<Options, 'to' | 'subject' | 'cc' | 'bcc'>,
  'to' | 'subject'
>;

export { type SendPageMailHeader };
