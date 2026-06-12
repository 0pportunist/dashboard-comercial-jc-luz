# Dashboard Comercial JC Luz

Dashboard web para acompanhamento de campanhas, rankings de produção e equipes comerciais da JC Luz Corretora de Seguros.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- Firebase Authentication
- React Router

## Executar

```bash
npm install
npm run dev
```

No Windows, também é possível executar `INICIAR DASHBOARD.cmd`.

## Configurar o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Registre um aplicativo Web no projeto.
3. Em **Authentication > Sign-in method**, habilite o provedor Google.
4. Em **Authentication > Settings > Authorized domains**, confirme os domínios usados pelo dashboard, incluindo `localhost` no desenvolvimento.
5. Copie `.env.example` para `.env` e preencha a configuração do aplicativo Web:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

O arquivo `.env` é ignorado pelo Git e não deve ser enviado ao repositório.

### Sem Firebase Analytics

Este projeto utiliza apenas o **Firebase Authentication** para o login com Google. O Analytics não está habilitado:

- não existe variável `VITE_FIREBASE_MEASUREMENT_ID`;
- o `firebaseConfig` não possui `measurementId`;
- `getAnalytics` não é importado nem executado;
- não é necessário ativar Google Analytics ao criar o projeto no Firebase Console.

Documentação oficial:

- [Configurar Firebase para Web](https://firebase.google.com/docs/web/setup)
- [Login Google no Firebase Auth](https://firebase.google.com/docs/auth/web/google-signin)
- [Custom claims e controle de acesso](https://firebase.google.com/docs/auth/admin/custom-claims)

## Papéis e permissões

O dashboard reconhece os papéis:

- `admin`: visualiza métricas, equipes, campanhas e rankings completos.
- `supervisor`: visualiza métricas, corretores e produção apenas da equipe vinculada.
- `corretor`: visualiza somente sua produção e campanhas elegíveis para corretores.

As custom claims têm prioridade. Os formatos esperados são:

```json
{ "role": "admin" }
```

```json
{ "role": "supervisor", "teamId": "equipe-mclaren" }
```

```json
{ "role": "corretor", "brokerName": "Danielle Simões Santiago" }
```

As claims devem ser definidas somente em ambiente confiável com Firebase Admin SDK. Exemplo:

```js
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

initializeApp({ credential: applicationDefault() })

const user = await getAuth().getUserByEmail('usuario@empresa.com')
await getAuth().setCustomUserClaims(user.uid, {
  role: 'supervisor',
  teamId: 'equipe-mclaren',
})
```

Depois de alterar claims, o usuário deve sair e entrar novamente para receber um novo token.

### Mapeamento por e-mail

Enquanto as claims não estiverem configuradas, também é possível usar o `.env`:

```env
VITE_ADMIN_EMAILS=chsmluz@gmail.com,diretoria@empresa.com
VITE_SUPERVISOR_EMAIL_MAP={"supervisor@empresa.com":"equipe-mclaren"}
VITE_BROKER_EMAIL_MAP={"corretor@empresa.com":"Danielle Simões Santiago"}
```

Os IDs disponíveis para equipes ficam em `src/data/teams.ts`. Os nomes dos corretores precisam corresponder aos registros em `src/data/rankings.ts`.

Usuários sem claim ou mapeamento recebem o papel mínimo `corretor`, sem produção vinculada.

> Os guards do React controlam a interface. Dados reais também devem ser protegidos no backend ou por Firebase Security Rules, validando o token e suas claims.

## Estrutura principal

- `src/data/campaigns.ts`: campanhas, regras, metas e progresso.
- `src/data/rankings.ts`: rankings e resumo do relatório de produção.
- `src/data/teams.ts`: departamentos, equipes e supervisores.
- `src/services/firebase.ts`: inicialização do Firebase.
- `src/contexts/AuthContext.tsx`: sessão, login Google e resolução do papel.
- `src/config/accessControl.ts`: fallback de acesso por e-mail.
- `src/components/auth`: proteção de rotas e seções.
- `src/pages/Login.tsx`: login público.
- `src/pages/Dashboard.tsx`: dashboard protegido e filtrado por papel.
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
