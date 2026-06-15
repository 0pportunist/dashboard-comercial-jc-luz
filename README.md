# Dashboard Comercial JC Luz

Dashboard web para acompanhamento de campanhas, rankings de produção e equipes comerciais da JC Luz Corretora de Seguros.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- PDF.js

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

### Segurança

- Nunca versione o arquivo `.env` nem compartilhe a senha administrativa em commits, mensagens ou capturas de tela.
- A senha atual é adequada somente para ambiente local ou rede interna controlada. Em produção, migre para autenticação no servidor com hash de senha, tokens de sessão e controle de papéis.
- O chat sanitiza entradas e respostas com DOMPurify. Caso HTML seja renderizado no futuro, use apenas conteúdo retornado por `sanitizeHtml` antes de chamar `dangerouslySetInnerHTML`.
- Execute `npm audit` regularmente e mantenha Vite e suas dependências atualizados.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/login`, digite a senha definida em `VITE_ADMIN_PASSWORD` e clique em **Entrar**.

No Windows, também é possível executar `INICIAR DASHBOARD.cmd`.

### Acesso na rede local

O servidor de desenvolvimento escuta em todas as interfaces de rede. Ao iniciar, o Vite e o script do Windows
mostram o IP atual e criam `ACESSO-REDE-LOCAL.txt` com os endereços disponíveis.

Prefira o endereço pelo nome da máquina, por exemplo `http://CARLOS-HENRIQUE:5173/login`, pois ele continua igual
quando o roteador altera o IP. Caso o nome não seja reconhecido em outro dispositivo, use o endereço de IP atual
registrado no arquivo, como `http://192.168.0.120:5173/login`.

Se outro dispositivo não conseguir acessar, permita conexões TCP de entrada na porta `5173` no Firewall do Windows.
O computador que executa o dashboard deve permanecer ligado e com o servidor Vite em execução.

## Estrutura principal

- `src/contexts/AuthContext.tsx`: autenticação em memória e comparação da senha.
- `src/contexts/DataContext.tsx`: campanhas e relatórios editáveis salvos no navegador.
- `src/components/auth/PrivateRoute.tsx`: proteção da rota administrativa.
- `src/components/auth/AdminRoute.tsx`: restringe a administração ao papel `admin`.
- `src/pages/Login.tsx`: formulário de senha.
- `src/pages/Dashboard.tsx`: dashboard protegido.
- `src/pages/Admin.tsx`: importa relatórios e cadastra campanhas.
- `src/pages/AssistantPage.tsx`: interface de chat do assistente comercial.
- `src/services/assistant.ts`: regras e análise dos dados internos do assistente.
- `src/utils/reportParser.ts`: extrai dados dos PDFs SixVox.
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

### Administração

Após entrar, clique em **Administração** no cabeçalho.

- **Adicionar relatório:** envie um PDF SixVox de produção de corretores ou supervisores. O sistema identifica o tipo, extrai período, emissão, totais e ranking e apresenta uma prévia antes da confirmação.
- **Nova campanha:** informe período, operadoras, prêmio, público, regras, meta e imagem. A campanha passa a integrar indicadores, filtros e cards imediatamente.
- **Gerenciar campanhas:** busque campanhas existentes, filtre por status e atualize período, prêmio, público, operadoras, regras, metas, progresso e imagem.

Nesta versão, alterações administrativas são persistidas em `localStorage`, apenas no navegador em que foram cadastradas. Para compartilhar atualizações automaticamente entre vários computadores, conecte o `DataContext` a uma API e banco de dados.

### Assistente de IA

A aba **Assistente de IA** oferece um chat baseado em regras e nos dados internos do dashboard. Ele responde perguntas sobre:

- campanhas ativas, prazos, prêmios, regras, metas e progresso;
- rankings de corretores e supervisores;
- produção e responsáveis das equipes;
- sugestões de rota comercial por operadora.

Exemplos: `Quais campanhas estão ativas?`, `Quanto falta para a meta do Cruzeiro Internacional?`, `Quem lidera o ranking?` e `Qual a rota de vendas?`.

O assistente não consulta a internet nem serviços externos. Quando os rankings não informam a operadora de cada venda, ele sinaliza a limitação e sugere uma rota alternativa baseada nas campanhas ativas, sem inventar dados. Perguntas fora desse escopo recebem uma resposta padrão.

## Integração futura

Para conectar dados reais, crie uma camada em `src/services` e substitua os imports estáticos dos arquivos em `src/data`.

## Validação

```bash
npm run lint
npm run build
```
