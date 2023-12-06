const MailerMessage = {
  SMTP_CONNECTION_ERROR: 'Mailer: SMTP connection not established.',
  SMTP_CONNECTION_SUCCESS: 'SMTP connection successfully established.',
  SMTP_CONNECTION_CLOSED: 'SMTP connection successfully closed.',
  SMTP_CONNECTION_STARTUP_ERROR: 'Mailer service: error during the startup!',
} as const;

export { MailerMessage };
