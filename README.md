# Dashboard Comercial JC Luz

Dashboard web para acompanhamento de campanhas, rankings de produção e equipes comerciais da JC Luz Corretora de Seguros.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React

## Configurar o acesso

O dashboard usa uma senha administrativa simples, configurada localmente.

1. Copie `.env.example` para `.env`.
2. Defina uma senha:

```env
VITE_ADMIN_PASSWORD=sua-senha-aqui
```

O arquivo `.env` é ignorado pelo Git e não deve ser enviado ao repositório. Depois de alterar a senha, reinicie o servidor Vite.

O estado de autenticação fica somente na memória do React. Ele não usa `localStorage`, `sessionStorage` ou cookies. Ao atualizar ou fechar a aba, será necessário digitar a senha novamente.

> Este mecanismo serve como controle simples para a primeira versão em ambiente interno. Variáveis `VITE_*` são incluídas no JavaScript entregue ao navegador e não protegem uma aplicação publicada na internet. Para produção pública, use autenticação e validação no servidor.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/login`, digite a senha definida em `VITE_ADMIN_PASSWORD` e clique em **Entrar**.

No Windows, também é possível executar `INICIAR DASHBOARD.cmd`.

## Estrutura principal

- `src/contexts/AuthContext.tsx`: autenticação em memória e comparação da senha.
- `src/components/auth/PrivateRoute.tsx`: proteção da rota administrativa.
- `src/pages/Login.tsx`: formulário de senha.
- `src/pages/Dashboard.tsx`: dashboard protegido.
- `src/data/campaigns.ts`: campanhas, regras, metas e progresso.
- `src/data/rankings.ts`: rankings e resumo do relatório de produção.
- `src/data/teams.ts`: departamentos, equipes e supervisores.
- `src/assets/team-logos`: logos das equipes e imagem padrão.
- `src/utils/getTeamLogo.ts`: localização automática das logos.
- `public/campaigns`: artes oficiais das campanhas.

## Logos das equipes

Coloque as imagens em `src/assets/team-logos` usando exatamente o mesmo nome cadastrado em `src/data/teams.ts`.
Por exemplo, a equipe `Equipe Alpha` deve usar `Equipe Alpha.png` ou `Equipe Alpha.jpg`.

São aceitos arquivos `.png`, `.jpg`, `.jpeg` e `.svg`. Quando nenhuma imagem correspondente é encontrada, o dashboard usa `default-logo.svg`.

## Dados

Os rankings usam relatórios SixVox referentes ao período de 1 a 30 de maio de 2026. Dados ausentes nos relatórios não devem ser inferidos.

## Integração futura

Para conectar dados reais, crie uma camada em `src/services` e substitua os imports estáticos dos arquivos em `src/data`.

## Validação

```bash
npm run lint
npm run build
```
