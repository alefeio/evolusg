# Armazenamento público

`PUBLIC FILE STORAGE = APIMG`

`APIMG_STORAGE_CLASSIFICATION = PUBLIC_NON_CLINICAL_ONLY`

A fundação vive em `src/lib/storage/apimg.ts` e só roda no servidor (`import "server-only"`). Não há botão, campo de arquivo nem rota genérica de upload.

## Contrato

`APIMG API: https://apimg.com.br/v1/upload`

`AUTH: X-API-Key server-side only`

`BODY: multipart field file`

Variáveis: `APIMG_UPLOAD_URL` e `APIMG_API_KEY`. Nenhuma das duas usa prefixo `NEXT_PUBLIC_`. A chave não entra no navegador, no resultado nem em erro serializado.

O POST não envia pasta. O runtime gera o boundary do multipart; o código não fixa `Content-Type: multipart/form-data`.

## Limite clínico

`PUBLIC STORAGE: non-clinical only`

`CLINICAL STORAGE: NOT IMPLEMENTED`

`PRIVATE_CLINICAL_STORAGE_REQUIRED_BEFORE_PATIENT_FILE_UPLOAD`

Uma URL pública da APIMG nunca deve ser tratada como autorização de acesso a dado clínico.

Nesta versão é proibido usar a APIMG para imagem de ultrassonografia de paciente, captura de equipamento com identificação, laudo, PDF clínico, documento médico, dado pessoal de paciente, nome junto de dado clínico, CPF, data de nascimento associada a exame, ou qualquer dado de saúde identificável.

O primeiro consumidor público, quando existir, terá endpoint próprio com autenticação, ownership, finalidade, MIME allowlist e limite de tamanho. Não haverá `POST /api/upload`.

Vercel Blob não faz parte desta estratégia.
