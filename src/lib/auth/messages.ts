export const AUTH_MESSAGES = {
  generic: "Não foi possível concluir esta ação. Tente novamente.",
  credentials: "E-mail ou senha inválidos.",
  registrationBlocked:
    "Este e-mail não está autorizado para cadastro neste momento.",
  unverified:
    "Confirme seu e-mail para entrar. Se precisar, reenvie o link de verificação.",
  verificationSent:
    "Se o cadastro for possível, enviaremos um e-mail com as próximas instruções.",
  resetRequested:
    "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.",
  resetDone: "Senha redefinida. Entre novamente com a nova senha.",
  passwordChanged: "Senha alterada. As demais sessões foram encerradas.",
  nameChanged: "Nome atualizado.",
  emailChangeStarted:
    "Enviamos uma confirmação para o e-mail atual. A alteração só vale depois da verificação.",
  emailChanged: "E-mail atualizado.",
  invalidToken: "Este link é inválido. Solicite um novo.",
  expiredToken: "Este link expirou. Solicite um novo.",
  rateLimited: "Muitas tentativas. Aguarde um pouco e tente novamente.",
  emailNotConfigured:
    "Não foi possível enviar o e-mail neste momento. Tente novamente mais tarde.",
  sessionsRevoked: "As demais sessões foram encerradas.",
  sessionRevoked: "Sessão encerrada.",
  loggedOut: "Sessão encerrada.",
} as const;

export function mapAuthError(error: {
  message?: string | null;
  status?: number | null;
  statusText?: string | null;
  code?: string | null;
} | null | undefined): string {
  if (!error) {
    return AUTH_MESSAGES.generic;
  }

  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();
  const status = error.status ?? 0;

  if (status === 429 || message.includes("too many") || code.includes("rate")) {
    return AUTH_MESSAGES.rateLimited;
  }

  if (
    message.includes("registration_not_allowed") ||
    message.includes("not authorized") ||
    code.includes("registration_not_allowed")
  ) {
    return AUTH_MESSAGES.registrationBlocked;
  }

  if (
    message.includes("email_not_verified") ||
    code.includes("email_not_verified") ||
    (message.includes("verify") && message.includes("email"))
  ) {
    return AUTH_MESSAGES.unverified;
  }

  if (
    message.includes("expired") ||
    code.includes("expired") ||
    message.includes("token_expired")
  ) {
    return AUTH_MESSAGES.expiredToken;
  }

  if (
    message.includes("invalid_token") ||
    code.includes("invalid_token") ||
    (message.includes("invalid") && message.includes("token"))
  ) {
    return AUTH_MESSAGES.invalidToken;
  }

  if (
    message.includes("invalid email or password") ||
    message.includes("invalid password") ||
    message.includes("invalid credentials") ||
    code.includes("invalid_email_or_password")
  ) {
    return AUTH_MESSAGES.credentials;
  }

  if (message.includes("email_not_configured") || code.includes("email_not_configured")) {
    return AUTH_MESSAGES.emailNotConfigured;
  }

  return AUTH_MESSAGES.generic;
}
