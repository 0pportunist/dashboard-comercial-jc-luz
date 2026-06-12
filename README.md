# Dashboard Comercial JC Luz

Dashboard web para acompanhamento de campanhas, rankings de produção e equipes comerciais da JC Luz Corretora de Seguros.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React

## Executar

```bash
npm install
npm run dev
```

No Windows, também é possível executar `INICIAR DASHBOARD.cmd`.

## Estrutura principal

- `src/data/campaigns.ts`: campanhas, regras, metas e progresso.
- `src/data/rankings.ts`: rankings e resumo do relatório de produção.
- `src/data/teams.ts`: departamentos, equipes e supervisores.
- `src/components`: componentes reutilizáveis do dashboard.
- `src/assets/team-logos`: logos das equipes e imagem padrão.
- `public/campaigns`: artes oficiais das campanhas.

## Logos das equipes

Coloque as imagens em `src/assets/team-logos` usando exatamente o mesmo nome cadastrado em `src/data/teams.ts`.
Por exemplo, a equipe `Equipe Alpha` deve usar um arquivo como `Equipe Alpha.png` ou `Equipe Alpha.jpg`.

São aceitos arquivos `.png`, `.jpg`, `.jpeg` e `.svg`. O Vite encontra as imagens automaticamente por meio de
`src/utils/getTeamLogo.ts`, portanto não é necessário alterar imports ou componentes ao adicionar uma nova logo.
Quando nenhuma imagem correspondente é encontrada, o dashboard usa `default-logo.svg`.

## Dados

Os rankings usam relatórios SixVox referentes ao período de 1 a 30 de maio de 2026. Dados que não aparecem nos relatórios, como operadora por venda e vínculo individual com campanhas, não devem ser inferidos.

## Integração futura

Para conectar dados reais, crie uma camada em `src/services` e substitua os imports estáticos dos arquivos em `src/data`. A integração de vendas em tempo real deve alimentar rankings, metas e progresso das campanhas.

## Validação

```bash
npm run lint
npm run build
```
