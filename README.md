# SGAI-Go — Sistema de Gestão Ambiental Integrado de Goiás

Web service REST + JSON (Spring Boot) com consumidora web (Next.js) para gestão ambiental
conforme ISO 14001, no contexto do estado de Goiás. Trabalho de APS 7º–8º (Ciência da Computação).

> Plano completo do projeto: [PLANO-DESENVOLVIMENTO.md](PLANO-DESENVOLVIMENTO.md)

---

## Requisitos da máquina

| Ferramenta | Versão testada | Observação |
|---|---|---|
| Java JDK | **26** | O wrapper do Gradle usa a JDK do sistema |
| Node.js + npm | **v25 / v11** | Para a aplicação consumidora |
| Docker Desktop | **26+** | Postgres 16, pgAdmin e, no futuro, Redis |
| Git | qualquer | Para versionar |

Não precisa instalar Gradle nem Maven: o **wrapper `gradlew.bat`** baixa tudo sozinho.

---

## Passo a passo para executar

### Passo 1 — Banco de dados (PostgreSQL + pgAdmin)

```powershell
cd C:\xampp\htdocs\aps-8
docker compose up -d
```

Isso sobe dois containers:

| Serviço | URL / Porta | Login |
|---|---|---|
| **PostgreSQL 16** | `localhost:5432` | user `sgaigo` / senha `sgaigo` / db `sgaigo` |
| **pgAdmin 4 (visual)** | <http://localhost:5050> | `admin@sgaigo.com.br` / `admin123` |

No primeiro boot, o banco já vem **populado** com:
- os 246 municípios de Goiás (origem IBGE)
- 5 organizações exemplo, licenças em prazos variados, NCs, ações, stakeholders
- 12 meses de medições e resíduos (dashboard nasce com gráficos)
- 3 usuários demo (ver passo 4)

> Se mudar algo nos arquivos de `db/init`, resete: `docker compose down -v && docker compose up -d`
> (o `-v` apaga o volume e força recarga).

### Passo 2 — Visualizar o banco (opcional, mas útil)

1. Abra <http://localhost:5050> e entre com `admin@sgaigo.com.br` / `admin123`.
2. Na árvore à esquerda, expanda **SGAI-Go (PostgreSQL 16)** — se pedir senha, digite `sgaigo`.
   - Se aparecer "failed to resolve host 'db'", use a conexão alternativa **"— host local"** (mesmo grupo "SGAI-Go"), que fala pela porta mapeada no Windows.
3. Navegue por `Databases → sgaigo → Schemas → public → Tables` para ver as 12 tabelas.

### Passo 3 — Web service (API)

```powershell
cd C:\xampp\htdocs\aps-8\api
.\gradlew.bat bootRun
```

- API em <http://localhost:8080>
- **Swagger UI** (documentação interativa): <http://localhost:8080/swagger-ui/index.html>

Logs úteis do script de carga: o backend aguarda o Postgres ficar saudável; se a porta 8080 estiver ocupada, mate o processo:
```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Passo 4 — Aplicação consumidora (Next.js)

```powershell
cd C:\xampp\htdocs\aps-8\web
npm install
npm run dev
```

- App em <http://localhost:3000>
- Tela de login demo:

| E-mail | Senha | Perfil |
|---|---|---|
| admin@sgaigo.com.br | senha123 | ADMIN (tudo) |
| gestor@sgaigo.com.br | senha123 | GESTOR (CRUD ambiental) |
| consultor@sgaigo.com.br | senha123 | CONSULTOR (só leitura + relatórios) |

O App fala com a API via proxy interno (`/api/*` e `/ws`) — não precisa liberar CORS manualmente.

---

## O que demonstrar na apresentação

1. **Login** com perfis diferentes (só o ADMIN vê a tela Usuários).
2. **Dashboard** — KPIs de água/energia/CO₂, banner de licenças vencendo, gráfico evolutivo.
3. **Organizações** — cadastre uma nova digitando o CNPJ e clicando em **"Buscar CNPJ (BrasilAPI)"** (auto-preenche endereço, razão social e município).
4. **Qualidade do ar** (Integrações) — selecione Goiânia para ver PM2.5/PM10/CO ao vivo (Open-Meteo).
5. **Mapa de queimadas** — bring placeholder se não tiver a chave; com `FIRMS_MAP_KEY` preenche o mapa.
6. **Tempo real (WebSocket)** — abra o dashboard em dois navegadores; lance uma medição em um e veja aparecer na aba "Tempo Real" do outro sem recarregar.
7. **Relatórios** — baixe CSV de resíduos e PDF de licenças.
8. **Swagger UI** — mostre e teste um endpoint direto na documentação gerada automaticamente.

---

## Estrutura do repositório

```
aps-8/
├── api/                          ← Web service Spring Boot (Gradle Groovy, Java 26)
│   ├── src/main/java/br/edu/aps/sgaigo/
│   │   ├── controller/  service/  repository/  model/  dto/    ← camadas SOLID
│   │   ├── security/    config/   exception/   integration/ websocket/ scheduler/
│   ├── build.gradle              ← Java 26 toolchain, wrapper gradlew incluído
│   └── src/main/resources/application.properties
├── web/                          ← Consumidora Next.js 16 (App Router, TS estrito)
│   ├── app/(public)/login/       ← rota pública
│   ├── app/(protected)/…         ← rotas protegidas + layout com sidebar
│   ├── lib/api.ts                ← cliente HTTP central (interceptor 401/403)
│   ├── hooks/useWebSocket.ts     ← assina /topic/alertas e /topic/monitoramentos
│   ├── components/ui/            ← shadcn/ui + Tailwind
│   └── components/features/      ← componentes por módulo
├── db/init/                      ← SQL carregado no 1º boot do container
│   ├── 01_schema.sql             ← 12 tabelas + FKs + índices
│   ├── 02_carga_municipios.sql   ← 246 municípios de GO (IBGE)
│   └── 03_carga_demo.sql         ← dados para apresentação
├── pgadmin/servers.json          ← conexões pré-cadastradas no pgAdmin
├── docker-compose.yml
├── test-ws.mjs                   ← teste E2E do canal WebSocket
└── PLANO-DESENVOLVIMENTO.md      ← plano completo (deriva o documento acadêmico)
```

---

## Variáveis de ambiente

| Variável | Padrão | Uso |
|---|---|---|
| `JWT_SECRET` | dev (muda em produção) | Segredo do token JWT |
| `FIRMS_MAP_KEY` | *(vazio)* | Chave gratuita da NASA FIRMS (ativar o mapa de queimadas) — registrar em firms.modaps.eosdis.nasa.gov |

Exemplo com queimadas ativadas:
```powershell
$env:FIRMS_MAP_KEY = "sua-chave"
cd C:\xampp\htdocs\aps-8\api; .\gradlew.bat bootRun
```

## Parar tudo

```powershell
docker compose down
```

*(o banco e o pgAdmin param; os dois serviços Java/Next você para com Ctrl+C nos terminais).*
