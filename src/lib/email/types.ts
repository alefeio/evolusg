export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSender = {
  send: (input: SendEmailInput) => Promise<void>;
};
