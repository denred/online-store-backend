import { createTransport, type Transporter } from 'nodemailer';
import { type Options } from 'nodemailer/lib/mailer';

import { MailerConnectionError } from '~/libs/exceptions/exceptions.js';

import { type IConfig } from '../config/config.js';
import { type EnvironmentSchema } from '../config/types/types.js';
import { type ILogger } from '../logger/logger.js';
import { MailerConfig, MailerMessage } from './libs/enums/enums.js';

type Constructor = { config: IConfig<EnvironmentSchema>; logger: ILogger };

class Mailer {
  private connection: Transporter | undefined;

  private appConfig: IConfig<EnvironmentSchema>;

  private logger: ILogger;

  public constructor({ config, logger }: Constructor) {
    this.appConfig = config;
    this.logger = logger;
  }

  public async send(options: Omit<Options, 'from'>): Promise<void> {
    await this.connection?.sendMail(options);
  }

  public getTransporter(): Transporter {
    if (!this.connection) {
      throw new MailerConnectionError({
        message: MailerMessage.SMTP_CONNECTION_ERROR,
      });
    }

    return this.connection;
  }

  public async connect(): Promise<void> {
    this.connection = createTransport(
      {
        host: MailerConfig.SMTP_HOST,
        port: MailerConfig.SMTP_PORT,
        secure: MailerConfig.SECURE,
        auth: {
          user: this.appConfig.ENV.MAILER.SENDGRID_USER,
          pass: this.appConfig.ENV.MAILER.SENDGRID_API_KEY,
        },
      },
      { from: this.appConfig.ENV.MAILER.SENDGRID_SENDER_EMAIL },
    );

    try {
      await this.connection.verify();
      this.logger.info(MailerMessage.SMTP_CONNECTION_SUCCESS);
    } catch {
      throw new MailerConnectionError({
        message: MailerMessage.SMTP_CONNECTION_ERROR,
      });
    }
  }

  public disconnect(): void {
    if (!this.connection) {
      return;
    }
    this.connection.close();

    this.logger.info(MailerMessage.SMTP_CONNECTION_CLOSED);
  }
}

export { Mailer };
