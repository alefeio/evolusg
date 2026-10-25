# Contas fictícias de QA

`TEST_ACCOUNT_DEFAULT_PASSWORD = 12345678`

Essa senha vale só para contas fictícias criadas para QA. Não é senha de conta real, não é default de produção e não deve ser usada por médica ou usuário real. A política mínima continua em 8 caracteres; `123456` não é aceito.

## Recuperação de senha em evolusg.com.br

E2E de 2026-10-25, somente com a conta sintética `alefeio+evolusg.qa@gmail.com`, no domínio `https://evolusg.com.br`.

- Cadastro pelo fluxo normal, com verificação de e-mail.
- Remetente `@evolusg.com.br`.
- Link de verificação em `https://evolusg.com.br/api/auth/verify-email`.
- Link de recuperação em `https://evolusg.com.br/redefinir-senha`.
- A senha anterior deixou de funcionar, a sessão anterior foi revogada e o token não pôde ser reutilizado.
- A senha da conta voltou para `12345678` pela troca normal da conta.
- Nenhum token foi registrado aqui.

`PASSWORD RESET — E2E VERIFIED`

O token de redefinição expira em 3600 segundos.
