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
- `public/campaigns`: artes oficiais das campanhas.

## Dados

Os rankings usam relatórios SixVox referentes ao período de 1 a 30 de maio de 2026. Dados que não aparecem nos relatórios, como operadora por venda e vínculo individual com campanhas, não devem ser inferidos.

## Integração futura

Para conectar dados reais, crie uma camada em `src/services` e substitua os imports estáticos dos arquivos em `src/data`. A integração de vendas em tempo real deve alimentar rankings, metas e progresso das campanhas.

## Validação

```bash
npm run lint
npm run build
```
