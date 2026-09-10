import { escapeHtml } from "@/lib/email/escape";

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fffaf3;border:1px solid #e7e0d4;border-radius:12px;">
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#57534e;">evolUSG</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;">${escapeHtml(title)}</h1>
          ${body}
          <p style="margin:28px 0 0;font-size:13px;color:#78716c;">Se você não solicitou esta mensagem, pode ignorá-la.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function verificationEmailHtml(url: string): string {
  const safeUrl = escapeHtml(url);
  return layout(
    "Confirme seu e-mail",
    `<p>Para ativar sua conta no evolUSG, confirme o endereço de e-mail.</p>
     <p><a href="${safeUrl}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#1c1917;color:#fffaf3;text-decoration:none;border-radius:8px;">Verificar e-mail</a></p>`,
  );
}

export function resetPasswordEmailHtml(url: string): string {
  const safeUrl = escapeHtml(url);
  return layout(
    "Redefinir senha",
    `<p>Recebemos um pedido para redefinir a senha da sua conta.</p>
     <p><a href="${safeUrl}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#1c1917;color:#fffaf3;text-decoration:none;border-radius:8px;">Escolher nova senha</a></p>`,
  );
}

export function changeEmailConfirmHtml(newEmail: string, url: string): string {
  const safeUrl = escapeHtml(url);
  return layout(
    "Confirmar troca de e-mail",
    `<p>Foi solicitado alterar o e-mail da conta para <strong>${escapeHtml(newEmail)}</strong>.</p>
     <p><a href="${safeUrl}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#1c1917;color:#fffaf3;text-decoration:none;border-radius:8px;">Aprovar alteração</a></p>`,
  );
}

export function verificationEmailText(url: string): string {
  return `evolUSG — Confirme seu e-mail\n\n${url}\n`;
}

export function resetPasswordEmailText(url: string): string {
  return `evolUSG — Redefinir senha\n\n${url}\n`;
}

export function changeEmailConfirmText(newEmail: string, url: string): string {
  return `evolUSG — Confirmar troca de e-mail para ${newEmail}\n\n${url}\n`;
}
