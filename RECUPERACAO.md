# OrçaZap — versão recuperada e estabilizada

Esta cópia foi reconstruída a partir do checkpoint funcional `336408f` existente no próprio projeto enviado.

## Correções aplicadas

- Restaurado `app/dashboard/page.tsx` para a versão do checkpoint `336408f`.
- Removidos `app/dashboard/dashboard.css` e `app/dashboard/dashboard.module.css`, que eram arquivos experimentais e estavam causando a inconsistência visual.
- Preservadas as páginas e APIs do projeto: clientes, orçamentos, novo orçamento, edição, precificação, follow-ups, orçamento público e APIs/Prisma.
- Mantido `app/page.tsx` com redirecionamento para `/dashboard`.
- Arquivos que tinham apenas diferenças de formatação/line endings foram restaurados ao checkpoint, sem alterar a lógica funcional.

## Importante

O `.env` não está neste pacote por segurança. Mantenha o `.env` da sua instalação atual e copie-o para esta pasta depois de extrair.

## Instalação segura

1. NÃO apague a pasta atual ainda.
2. Extraia esta versão para uma nova pasta.
3. Copie seu `.env` atual para a nova pasta.
4. Abra PowerShell nessa nova pasta.
5. Rode `npm install`.
6. Rode `npx prisma generate`.
7. Rode `npm run dev`.
8. Teste `http://localhost:3000` e todas as áreas antes de substituir a pasta antiga.

A pasta antiga deve permanecer como backup até a validação completa.
