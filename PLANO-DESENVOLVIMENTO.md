# SGAI-Go — Plano de Desenvolvimento
## Sistema de Gestão Ambiental Integrado de Goiás (APS 7º–8º Ciência da Computação)

> **Tema (conforme documento da APS):** "Desenvolvimento de uma aplicação utilizando web services
> em gestão ambiental no estado de Goiás (conhecimentos gerais das disciplinas aprendidos no curso)"
> — ações que minimizem impactos ambientais e implementem melhorias de procedimentos entre os
> stakeholders, alusivas à família ISO 14000/14001.

---

## 1. Visão do projeto

**SGAI-Go** é um sistema composto por duas partes independentes — exatamente como exige o documento
da APS ("implementação dos Web Services, assim como uma aplicação que os consuma"):

| Parte | Papel |
|---|---|
| **`api/`** — Web service REST + JSON em **Spring Boot** | Centraliza a gestão ambiental de organizações goianas conforme a ISO 14001: aspectos e impactos, resíduos, licenças, monitoramento, não conformidades, stakeholders e relatórios. Autenticação JWT, cache em camadas, integrações com APIs externas gratuitas e **4 canais WebSocket** para tempo real. |
| **`web/`** — Aplicação consumidora em **Next.js** | Dashboard com KPIs e gráficos, CRUD completo, mapa de queimadas em tempo real (Leaflet), relatórios para download e painel de integrações. Consome exclusivamente a API SGAI-Go via **React Query**. |

O sistema apoia decisões que **minimizam impactos ambientais** e **melhoram procedimentos entre os
stakeholders** (colaboradores, fornecedores, órgão ambiental estadual — IMASUL/Agência Ambiental de
Goiás — e comunidade), sempre no contexto do estado de Goiás.

---

## 2. Rastreamento dos requisitos do documento da APS

| Requisito do documento | Como o plano atende |
|---|---|
| Aplicação baseada em Web Services | API REST + JSON documentada com OpenAPI/Swagger + 4 canais WebSocket |
| Serviços ligados à gestão ambiental / ISO 14000 | Módulos de aspectos e impactos (grau de significância), resíduos, licenças, monitoramento, não conformidades e ações corretivas |
| Contexto do estado de Goiás | 246 municípios goianos (IBGE), licenças junto ao órgão ambiental estadual, mapa de queimadas no Cerrado |
| Implementação dos Web Services **e** aplicação consumidora | `api/` (Spring Boot) + `web/` (Next.js) como projetos separados |
| Dissertação sobre os elementos utilizados e a interdisciplinaridade | Etapa 8 produz o documento acadêmico completo |
| Refinamento, funcionalidade, tratamento de erros, extras e relatórios valem nota | CRUD completo, validações, erros HTTP padronizados, cache em 5 camadas, rate limiting, tempo real, mapa, integrações externas, relatórios PDF/CSV |
| Proposta submetida à aprovação do coordenador auxiliar | Etapa 0 entrega a proposta escrita antes do código |
| Grupo de 3 alunos | Capa com nome/RA dos 3 integrantes (a preencher) |

---

## 3. Stack final (confirmada)

| Camada | Tecnologia | Observações |
|---|---|---|
| Web service | **Spring Boot 3.x** (Java 17+) | Spring Web, Data JPA, Security + JWT, Validation, WebSocket (STOMP), springdoc-openapi, OpenPDF |
| Banco de dados | **PostgreSQL 16 via Docker** | `docker compose up -d`; XAMPP deixa de ser necessário (a pasta `htdocs` é apenas o diretório do projeto) |
| Admin visual do banco | **pgAdmin 4 via Docker** | `http://localhost:5050` — login `admin@sgaigo.com.br` / `admin123`; servidor "SGAI-Go (PostgreSQL 16)" pré-cadastrado |
| Aplicação consumidora | **Next.js 15 (App Router) + TypeScript estrito** | React Query (TanStack), react-hook-form + **zod** (schemas), **shadcn/ui** (componentes gerados no projeto) + **Tailwind CSS**, Chart.js, Leaflet + OpenStreetMap, stompjs + sockjs-client |
| Cache no servidor | **Caffeine** (in-process) | Evolução opcional: Redis (Docker) sem mudar os services |
| Proteção | **Bucket4j** (rate limiting) | Por usuário e por IP |
| Build Java | **Gradle (Wrapper `gradlew`, DSL Groovy)** | Build scripts em `build.gradle`; Gradle não está no PATH da máquina — o wrapper (`gradlew.bat`) baixa a distribuição sozinho |
| Protocolos | **REST (maioria) + WebSocket (4 canais)** | Ver seção 8 |

### Ambiente desta máquina (verificado)

| Ferramenta | Status |
|---|---|
| Java | ✅ JDK 26 instalado |
| Node.js / npm | ✅ v25.2.1 / 11.12.1 |
| Docker | ✅ 29.5.3 (usado para o PostgreSQL) |
| Maven | ❌ não instalado → substituído por **Gradle (DSL Groovy)** com wrapper `gradlew` |
| PostgreSQL | ❌ não instalado → resolvido com container Docker |
| Git | a confirmar na Etapa 1 |

---

## 4. Arquitetura

```
┌─────────────────────┐   REST (React Query)  ┌──────────────────────────┐   HTTP    ┌──────────────┐
│  Navegador          │◄─────────────────────►│  NEXT.JS :3000           │  polling  │ SPRING BOOT  │
│  (usuários)         │  WebSocket (STOMP)    │  telas, dashboard, mapa  │◄─────────►│ :8080  /api  │
└─────────────────────┘◄══════════════════════►└──────────────────────────┘   /ws     │   REST + WS  │
                                                                                       └──────┬───────┘
                ┌─────────────────────── cache em 5 camadas ──────────────────────────────┬┘
                │  L1 React Query → L2 ETag/Cache-Control → L3 Caffeine → L4 agregação → L5 banco  │
                ▼                                                                          ▼
        APIs externas gratuitas                                                   ┌────────────────┐
        (IBGE, Open-Meteo, BrasilAPI,                                             │ PostgreSQL 16  │
         FIRMS, ViaCEP, INMET/ANA)                                                │ (Docker :5432) │
                                                                                  └────────────────┘
```

- O Next.js usa **rewrites** no `next.config.js`: `/api/*` e `/ws` são repassados ao Spring Boot — o frontend nunca fala direto com o backend, evitando CORS em desenvolvimento.
- Cada requisição REST passa pelo **filtro JWT**; as conexões WebSocket exigem o mesmo JWT no handshake (header STOMP).

### Estrutura de diretórios

```
C:\xampp\htdocs\aps-8\
├── api\     → Spring Boot :8080 (web service)
│   └── src\main\java\br\edu\aps\sgaigo\
│       ├── controller\   service\   repository\   model\   dto\
│       ├── config\   security\   exception\   integration\   scheduler\
├── web\     → Next.js :3000 (consumidora)
│   └── app\  (App Router)  components\  lib\  hooks\
├── db\
│   ├── init\ → 01_schema.sql, 02_carga_municipios.sql, 03_carga_demo.sql
├── docs\    → proposta (Etapa 0), especificação OpenAPI, dissertação (Etapa 8)
├── docker-compose.yml
└── PLANO-DESENVOLVIMENTO.md  (este arquivo)
```

---

## 5. Escopo funcional (módulos do web service)

1. **Autenticação e usuários** — login com JWT (validade 8h), perfis: ADMIN, GESTOR, CONSULTOR.
2. **Organizações** — empresas/órgãos de Goiás: CNPJ (preenchimento automático via BrasilAPI), município (IBGE), porte, setor.
3. **Aspectos e impactos ambientais** — resíduos, efluentes, emissões, consumo de água/energia, com **grau de significância** calculado (critério ISO 14001).
4. **Inventário de resíduos** — tipo, classe, quantidade, unidade, destinação e destinatário final.
5. **Licenças ambientais** — número, órgão emissor, validade; alertas de vencimento (job diário `@Scheduled`).
6. **Monitoramento** — medições periódicas (água m³, energia kWh, CO₂ kg) por organização, com metas e indicadores de desempenho.
7. **Não conformidades e ações corretivas** — auditorias internas, gravidade, status (aberta/em tratamento/resolvida), plano de ação com prazo e responsável.
8. **Stakeholders** — partes interessadas e registro de comunicações/melhorias de procedimentos.
9. **Relatórios** — inventário de resíduos, balanço de indicadores, conformidade legal e **relatório ambiental integrado** (dados internos + qualidade do ar + queimadas da região); exportação PDF/CSV.
10. **Integrações externas** — módulo `integration/` com cache e fallback (seção 7).

---

## 6. Contrato da API REST

Base `/api/v1` · respostas JSON padronizadas · códigos HTTP corretos (200/201/304/400/401/403/404/422/429/500) · filtros, ordenação e **paginação obrigatória** nas listagens.

```
POST  /api/v1/auth/login                         POST /api/v1/auth/logout

GET/POST      /api/v1/organizacoes               GET/PUT/DELETE /api/v1/organizacoes/{id}
GET/POST      /api/v1/aspectos                   GET/PUT/DELETE /api/v1/aspectos/{id}
GET/POST      /api/v1/residuos                   GET/PUT/DELETE /api/v1/residuos/{id}
GET/POST      /api/v1/licencas                   GET/PUT/DELETE /api/v1/licencas/{id}
GET           /api/v1/licencas/vencendo?dias=30
GET/POST      /api/v1/monitoramentos             GET/PUT/DELETE /api/v1/monitoramentos/{id}
GET/POST      /api/v1/nao-conformidades          GET/PUT/DELETE /api/v1/nao-conformidades/{id}
GET/POST      /api/v1/acoes-corretivas           GET/PUT/DELETE /api/v1/acoes-corretivas/{id}
GET/POST      /api/v1/stakeholders               GET/PUT/DELETE /api/v1/stakeholders/{id}
GET/POST      /api/v1/usuarios                   (somente ADMIN)

GET           /api/v1/indicadores/{orgId}        (água/energia/CO₂ per capita, % metas, tendências)
GET           /api/v1/dashboard/resumo           (endpoint agregado — 1 request p/ o dashboard, cache 60s)
GET           /api/v1/municipios-goias           (carga própria servida do banco; origem IBGE)

POST          /api/v1/relatorios/residuos        (PDF/CSV por período/organização)
POST          /api/v1/relatorios/indicadores     (PDF/CSV)
POST          /api/v1/relatorios/conformidade    (PDF/CSV)
POST          /api/v1/relatorios/integrado       (PDF — dados internos + qualidade do ar + queimadas)

GET           /api/v1/integracoes/cnpj/{cnpj}    (proxy BrasilAPI com cache 7d)
GET           /api/v1/integracoes/qualidade-ar?municipio={codIBGE}
GET           /api/v1/integracoes/queimadas?bbox=...   (FIRMS; MAP_KEY gratuito)
```

### Formato padrão de resposta

**Sucesso:**
```json
{ "sucesso": true, "dados": { "...": "..." },
  "paginacao": { "pagina": 1, "porPagina": 20, "total": 137 } }
```

**Erro:**
```json
{ "sucesso": false,
  "erro": { "codigo": "VALIDACAO", "mensagem": "Dados inválidos",
            "detalhes": { "quantidade": "deve ser maior que zero" } } }
```

Exceções tratadas globalmente por `@ControllerAdvice`: validação (422), recurso inexistente (404),
acesso negado (403), rate limit (429 + `Retry-After`), erro inesperado (500, sem vazar stack trace).

---

## 7. Cache em 5 camadas (proteção contra alta demanda)

A proteção acontece **antes** de cada camada — quem chega ao PostgreSQL é o mínimo possível:

```
Navegador ─► L1 React Query ─► L2 Headers HTTP ─► L3 Caffeine ─► L4 Agregação ─► L5 PostgreSQL
```

| Camada | Onde | O que faz |
|---|---|---|
| **L1 — React Query** | Next.js | Cache client-side com stale-while-revalidate: N componentes pedindo o mesmo dado = **1 request**; `staleTime` casado com o TTL do backend; deduplicação automática; `placeholderData: keepPreviousData` (troca de página sem flash) |
| **L2 — Headers HTTP** | Spring Boot | `ETag` nas listagens (304 sem corpo quando nada mudou); `Cache-Control: max-age=60` em dados de referência |
| **L3 — Caffeine** | Spring Boot | TTLs por tipo: municípios IBGE **24h** (quase estático), CNPJ **7d**, qualidade do ar **1h**, queimadas **30 min** (satélite atualiza a cada ~3h), resumo do dashboard **60s** |
| **L4 — Endpoint agregado** | `GET /api/v1/dashboard/resumo` | Dashboard carrega com **1 request** em vez de 10; 50 usuários juntos geram 1 única **rajada de queries** por minuto |
| **L5 — Banco** | PostgreSQL | Pool HikariCP dimensionado, índices nas colunas de filtro/JOIN, paginação obrigatória (nada de SELECT sem LIMIT), JOINs planejados (sem N+1) |

**Proteções adicionais (valem nota):**
- **Rate limiting (Bucket4j)**: 60 req/min por usuário e 200/min por IP → excedeu = `429` + `Retry-After`; o React Query respeita o header (sem retry imediato).
- **WebSocket com backpressure**: broadcast só quando há novidade; heartbeat STOMP; clientes lentos descartados.
- **Contingência de cache offline do cliente**: se a API não responder, a UI mostra o último dado com badge "dados em cache".
- **Evolução opcional**: mais de 1 instância da API → troca de Caffeine por **Redis** (Docker) sem alterar os services.

---

## 8. WebSocket — escopo restrito (só 4 canais)

O sistema é **majoritariamente REST**. Tempo real apenas onde faz diferença:

| Recurso | Protocolo |
|---|---|
| CRUD completo, dashboard, relatórios, indicadores | **REST** (com cache L1–L4) |
| `/topic/queimadas` | **WebSocket** — novo foco no bbox de Goiás |
| `/topic/qualidade-ar` | **WebSocket** — mudança de índice/limiar excedido |
| `/topic/alertas` | **WebSocket** — licença vencendo, NC aberta, limiar de meta excedido |
| `/topic/monitoramentos/{orgId}` | **WebSocket** — novo lançamento de outro usuário (demo multiusuário) |

**Como funciona:** `spring-boot-starter-websocket` (STOMP sobre WebSocket) em `/ws`; agentes
`@Scheduled` consultam as fontes em intervalos e **só transmitem quando há novidade**:
FIRMS a cada 15–30 min (satélite atualiza ~3h), qualidade do ar a cada 1h, eventos internos
imediatamente. Autenticação pelo mesmo JWT no handshake; RBAC respeitado por tópico.
No cliente: hook `useWebSocket()` central com reconexão automática e indicador
"reconectando..." — a demo nunca quebra. Se o WebSocket cair, o dashboard volta ao
polling (`refetchInterval: 60_000` do React Query).

**Tela nova:** mapa **"Queimadas em tempo real"** (Leaflet + tiles OpenStreetMap, gratuitos) —
focos aparecem ao vivo com lat/long, satélite, confiança e município; filtro por município;
contador "X focos ativos no estado agora"; toast de foco próximo à organização.

---

## 9. Integrações externas (todas gratuitas)

### Verificadas nesta sessão (funcionando, sem custo)

| Serviço | O que fornece | Uso na aplicação | Status |
|---|---|---|---|
| **IBGE Localidades** — `servicodados.ibge.gov.br/api/v1/localidades` | Municípios, população, região | `<select>` dos 246 municípios de GO; população para indicadores per capita | ✅ HTTP 200 |
| **Open-Meteo Air Quality** — `air-quality-api.open-meteo.com/v1/air-quality` | PM2.5, PM10, O₃, CO por coordenadas | Painel "Qualidade do Ar" por município; cruzamento com emissões | ✅ HTTP 200 (PM2.5 Goiânia) |
| **BrasilAPI** — `brasilapi.com.br/api/cnpj/v1/{cnpj}` | Razão social, endereço, CNAE | CNPJ → auto-preenche dados da organização | ✅ HTTP 200 |
| **NASA FIRMS** — `firms.modaps.eosdis.nasa.gov` | Focos de queimadas em tempo quase real (CSV VIIRS) | Mapa de queimadas ao vivo + alerta de novo foco via WS | ✅ 240 focos retornados em GO |

### Candidatas gratuitas (rota exata validada na Etapa 1 — pendentes de configuração)

| Serviço | O que fornece | Uso | Custo/chave |
|---|---|---|---|
| **INMET** — `apitempo.inmet.gov.br` | Chuva, temperatura, umidade (estações de GO) | Contexto climático no monitoramento | Gratuita e pública |
| **NASA FIRMS** — `firms.modaps.eosdis.nasa.gov` | Focos de queimadas em tempo quase real | Mapa ao vivo + alertas de foco próximo | MAP_KEY gratuito (cadastro simples) |
| **ANA / SNIRH (Hidroweb)** — `api.ana.gov.br` | Níveis de rios, vazão, chuva | Contexto para metas de consumo de água | Gratuita; cadastro em alguns endpoints |
| **ViaCEP** — `viacep.com.br` | Endereço por CEP | Autocomplete de endereço | Gratuita, sem chave |

### Arquitetura de integração (módulo `integration/`)

```
Next.js ──► GET /api/v1/integracoes/qualidade-ar?municipio=5208707
                      │
             ┌────────▼─────────┐  1. Cache local (Caffeine, TTL por tipo)
             │  integration/    │  2. Timeout + retry (3 tentativas)
             │  (Spring Boot)   │  3. Fallback: API externa falhou → dado local
             └────────┬─────────┘     + "dadosIndisponiveis": true (não quebra a UI)
                      ▼
             APIs externas (IBGE, Open-Meteo, BrasilAPI, FIRMS…)
```

- O frontend consome **apenas a nossa API**; os proxies internos escondem as externas.
- Cache respeita limites das APIs gratuitas e evita chamadas repetidas na apresentação.
- Fallback garante que, se uma API externa cair durante a apresentação, o sistema continua funcionando.

---

## 10. Segurança e perfis (RBAC)

| Perfil | Permissões |
|---|---|
| **ADMIN** | Tudo, incluindo gestão de usuários e todas as organizações |
| **GESTOR** | CRUD ambiental apenas da(s) sua(s) organização(ões) |
| **CONSULTOR** | Somente leitura + geração de relatórios |

- O frontend **esconde** o que o perfil não pode; o backend **nega** de verdade (Spring Security, resposta 403).
- Senhas com BCrypt; JWT assinado com segredo em variável de ambiente.
- Conexão WebSocket autenticada no handshake; tópico por organização respeita o RBAC.

---

## 11. Telas da aplicação Next.js

| Rota | O que faz |
|---|---|
| `/login` | Autenticação, validação de campos, mensagens de erro |
| `/dashboard` | KPIs (água, energia, CO₂, % metas), banner de licenças vencendo, NCs abertas, gráficos de evolução, badges/toasts em tempo real |
| `/organizacoes` | CRUD com CNPJ auto-preenchido (BrasilAPI), município (IBGE), porte, setor |
| `/aspectos` | Matriz de aspectos e impactos com grau de significância (ISO 14001); filtros |
| `/residuos` | Inventário com classe, destinação, destinatário; totais por tipo |
| `/licencas` | Licenças com badge "vence em X dias" |
| `/monitoramentos` | Lançamentos mensais + gráfico de evolução (atualiza em tempo real via WebSocket) |
| `/nao-conformidades` | Auditorias, gravidade, status + ações corretivas vinculadas |
| `/stakeholders` | Partes interessadas e comunicações |
| `/relatorios` | Geração de PDF/CSV por tipo e período |
| `/integracoes` | Qualidade do ar por município + mapa de queimadas em tempo real (Leaflet) |
| `/usuarios` (ADMIN) | Cadastro de usuários e perfis |

Componentes-chave: `react-hook-form` (formulários), tabelas com busca/paginação server-side,
`LiveMap` (Leaflet), interceptor central de `fetch` (401 → login, 403 → "acesso negado",
toast global de erro/sucesso), React Query como única fonte de dados.

---

## 12. Modelo de dados (PostgreSQL)

`usuarios`, `organizacoes`, `municipios_go`, `aspectos_impactos`, `residuos`,
`licencas_ambientais`, `monitoramentos`, `metas_indicadores`, `nao_conformidades`,
`acoes_corretivas`, `stakeholders`, `logs_auditoria`.

- Chaves estrangeiras e integridade referencial.
- Coordenadas das organizações para distância até focos de queimada
  (opcional: extensão **PostGIS** com `GEOGRAPHY(POINT)` para consultas "a menos de X km").
- Índices: `municipio_id`, `organizacao_id`, `data_medicao`, `validade` (licenças), `status` (NCs).
- `docker-compose.yml` (resumo):

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: sgaigo
      POSTGRES_USER: sgaigo
      POSTGRES_PASSWORD: sgaigo
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data", "./db/init:/docker-entrypoint-initdb.d"]
  pgadmin:
    image: dpage/pgadmin4
    ports: ["5050:80"]
    depends_on: [db]
volumes: { pgdata: , pgadmin_data: }
```

### Dados de demonstração (para a apresentação)

246 municípios de GO (origem IBGE) · 5 organizações exemplo (indústria, agro, órgão público,
hospital, comércio) · 3 usuários (um por perfil) · licenças em diferentes vencimentos ·
12 meses de medições e resíduos — dashboard já nasce populado.

---

## 13. Etapas de desenvolvimento

| Etapa | Entrega |
|---|---|
| **0. Proposta** | Documento curto (tema, escopo, justificativa) para aprovação do coordenador auxiliar |
| **1. Setup + modelagem** | `docker-compose` do PostgreSQL; projetos Spring Boot (via Spring Initializr, build **Gradle — DSL Groovy** + wrapper `gradlew`) e Next.js criados; validação de versões (Java 26 × Gradle); **ESLint + Prettier (front) e Checkstyle/lint (back) configurados** — seção 16 vigente desde o primeiro commit; validação das rotas candidatas (INMET/ANA); diagrama E-R + especificação OpenAPI |
| **2. Banco de dados** | Entidades JPA + scripts SQL de criação e carga (`db/init`) com dados de demonstração |
| **3. Web service** | Endpoints CRUD, autenticação JWT, RBAC, validações, `@ControllerAdvice`, cache Caffeine, rate limit Bucket4j, headers ETag — **sempre na estrutura de camadas da seção 16.1 (SOLID/Clean Code)** |
| **4. Consumidora Next.js** | Login, layout, dashboard agregado (React Query), telas de CRUD e gráficos usando os componentes **shadcn/ui** (`npx shadcn@latest add ...` conforme a tela precisa) — **sempre na estrutura de páginas da seção 16.2 (SOLID/Clean Code)** |
| **5. Extras p/ nota** | WebSocket (4 canais) + mapa de queimadas (Leaflet), integrações externas com fallback, Swagger UI, logs de auditoria, alertas de vencimento, exportação PDF/CSV |
| **6. Relatórios** | Relatórios gerenciais + relatório ambiental integrado |
| **7. Testes e apresentação** | Testes de todos os endpoints (incl. 401/403/422/429), demo multiusuário (2 navegadores), dados de demonstração, roteiro de apresentação |
| **8. Documento acadêmico** | Dissertação conforme seção 14 |

---

## 14. Documento acadêmico (requisitos do documento da APS)

**Formato:** fonte ARIAL 12, espaçamento 1,5, margens direita e esquerda 2,5 cm, papel A4,
encadernado em espiral com capa transparente. Grupo de 3 alunos.

**Estrutura e limites de páginas:**

| Seção | Limite |
|---|---|
| Capa (curso, tema, alunos nome/RA) | — |
| Índice | — |
| Objetivo e motivação do trabalho | 1 pág. (máx. 2) |
| Introdução | 2 págs. (máx. 4) |
| Fundamentos e principais elementos dos Web Services (conceitos gerais) | 4 págs. (máx. 8) |
| **Plano de desenvolvimento da aplicação (elementos e ferramentas)** | **mín. 5 — máx. 15 págs.** |
| Projeto (estrutura e módulos) do programa | mín. 3 — máx. 8 págs. |
| Relatório com as linhas de código | máx. 10 págs. |
| Apresentação do programa em funcionamento | — |
| Bibliografia | — |
| Ficha de Atividades Práticas Supervisionadas | — |

> Conteúdos fortes para a seção de fundamentos: conceito de web service, **REST × SOAP × WebSocket**
> (request/response × push), JSON, HTTP e códigos de status, autenticação JWT, cache (HTTP, in-process,
> client-side), arquitetura em camadas. O arquivo `PLANO-DESENVOLVIMENTO.md` alimenta diretamente a
> seção "Plano de desenvolvimento da aplicação".

---

## 15. Como executar (roteiro de apresentação)

```powershell
# 1. Banco de dados + admin visual
docker compose up -d                # Postgres :5432  ·  pgAdmin :5050 (admin@sgaigo.com.br / admin123)

# 2. Web service (terminal 1)
cd api ; .\gradlew.bat bootRun        # http://localhost:8080  ·  Swagger: /swagger-ui.html

# 3. Aplicação consumidora (terminal 2)
cd web ; npm install ; npm run dev          # http://localhost:3000
```

Demonstrações planejadas: login com os 3 perfis · dashboard agregado com cache ·
CRUD completo com validações · Swagger UI · CNPJ auto-preenchido · mapa de queimadas ao vivo ·
demo multiusuário (lança medição em um navegador, o outro atualiza sozinho) · relatórios PDF/CSV ·
fallback de API externa (desligar internet → sistema continua com dado local).

---

## 16. Boas práticas — SOLID e Clean Code (back e front)

### 16.1 Backend (Spring Boot) — estrutura correta das camadas

```
api/src/main/java/br/edu/aps/sgaigo/
├── controller/    → controllers FINOS: recebem HTTP, validam entrada, chamam service, retornam DTO + status
├── service/       → regras de negócio (interface + impl): orquestra repositórios, integrações e eventos
├── repository/    → Spring Data JPA: queries nomeadas/Specifications, sem lógica de negócio
├── model/         → entidades JPA (persistência; sem regra de negócio pesada)
├── dto/           → Java records Request/Response (entidade NUNCA vaza para a API)
├── mapper/        → mapeamento entidade ↔ DTO (uma responsabilidade só)
├── exception/     → exceções de negócio + @ControllerAdvice global
├── security/      → JWT, filtros, UserDetailsService
├── integration/   → clientes de APIs externas (padrão Adapter: interface + impl)
├── scheduler/     → jobs @Scheduled que apenas orquestram (regra fica no service)
└── config/        → beans de infraestrutura (cache, websocket, openapi, CORS)
```

**SOLID aplicado ao back:**

| Princípio | No projeto |
|---|---|
| **S** — Responsabilidade única | Controller ≠ regra de negócio; `ResiduoService` só resíduos; `mapper/` só converte; `scheduler/` só agenda |
| **O** — Aberto/fechado | Novo tipo de relatório = nova classe `RelatorioStrategy` registrada num mapa — sem alterar código existente |
| **L** — Substituição de Liskov | `CacheService` com Caffeine hoje e Redis amanhã: mesma interface, troca transparente |
| **I** — Segregação de interfaces | Interfaces pequenas e específicas (`LicencaRepository`, `IntegracaoCnpjClient`) — nada de "ServiceGigante" |
| **D** — Inversão de dependência | Services dependem de abstrações (repository, client de integração) — permite testar com Mockito |

**Clean code no back:**

- Injeção **por construtor** (nunca `@Autowired` em campo); `final` nas dependências.
- DTOs com **Java records**; **enums** para domínio fechado (`ClasseResiduo`, `StatusNaoConformidade`); constantes para valores mágicos.
- Validação **declarativa** com Bean Validation nas DTOs (nada de `if` manual no controller).
- Métodos curtos, um propósito; nomes que revelam intenção (`contarResiduosPerigosos`, não `calc1`).
- Erros centralizados no `@ControllerAdvice`; serviços lançam exceções de negócio (`LicencaVencidaException`).
- Transações explícitas (`@Transactional` na camada de service, não no controller).
- **Testes unitários** dos services críticos com JUnit 5 + Mockito (nota: refinamento).

### 16.2 Frontend (Next.js) — estrutura correta das páginas

Roteamento pelo **App Router** com **route groups** — páginas só compõem, lógica fica fora:

```
web/
├── app/
│   ├── layout.tsx                 → raiz: fonte, globals, <Providers>
│   ├── providers.tsx              → React Query (QueryClientProvider) + toasts
│   ├── (public)/
│   │   └── login/page.tsx         → rota pública
│   ├── (protected)/
│   │   ├── layout.tsx             → guarda de rota (middleware do token) + sidebar + header
│   │   ├── dashboard/page.tsx     → compõe KpiCards + ChartEvolucao + AlertasTempoReal
│   │   ├── organizacoes/page.tsx  → compõe OrganizacaoTable + OrganizacaoFormModal
│   │   ├── aspectos/page.tsx
│   │   ├── residuos/page.tsx
│   │   ├── licencas/page.tsx
│   │   ├── monitoramentos/page.tsx
│   │   ├── nao-conformidades/page.tsx
│   │   ├── stakeholders/page.tsx
│   │   ├── relatorios/page.tsx
│   │   ├── integracoes/page.tsx   → QualidadeAr + LiveMap (Leaflet)
│   │   ├── usuarios/page.tsx      → somente ADMIN (guarda por perfil)
│   │   ├── loading.tsx / error.tsx → estados padrão por rota (App Router)
│   │   └── not-found.tsx
├── components/
│   ├── ui/            → componentes gerados pelo shadcn/ui (Button, Input, Select, Dialog, Table,
│   │                    Badge, Sonner (toasts — o Toast antigo foi descontinuado), Card, Tabs,
│   │                    AlertDialog…) — código no projeto,
│   │                    personalizável, construídos sobre Tailwind + Radix UI + CVA (variants)
│   └── features/      → residuos/ResiduoForm.tsx, residuos/ResiduoTable.tsx, licencas/LicencaBadge.tsx…
├── hooks/             → useAuth, useWebSocket, useMunicipios, usePermissao
├── lib/
│   ├── api.ts         → cliente HTTP central (fetch + interceptor 401/403/429 + toasts) — ÚNICO ponto que fala com a API
│   ├── queryKeys.ts   → chaves do React Query centralizadas (invalidateQueries sem string solta)
│   └── validators.ts  → schemas **zod** de formulário (compartilhados entre telas, ligados ao react-hook-form)
└── types/             → interfaces TS espelhando os DTOs do backend
```

**SOLID aplicado ao front:**

| Princípio | No projeto |
|---|---|
| **S** | Página só compõe; `ResiduoTable` só exibe; `ResiduoForm` só edita; hook só busca/estado |
| **O** | Componentes `ui/` do **shadcn/ui** extensíveis por variants com CVA (`<Button variant="destructive">`) — sem duplicar componente para cada cor/tamanho |
| **L** | Implementações trocáveis atrás do mesmo hook (mock de dados para testes visual) |
| **I** | Props pequenas e específicas; componentes recebem só o que usam |
| **D** | Telas dependem de **hooks** (`useResiduos`) e nunca chamam `fetch` direto — a implementação fica isolada em `lib/api.ts` |

**Clean code no front:**

- **TypeScript estrito** — nenhum `any`; tipos em `types/` espelham os DTOs do backend.
- Sem lógica de negócio dentro de componentes: extraída para hooks (`useResiduos`) ou `lib/`.
- Estados **explícitos** em toda tela: carregando, erro, vazio, sucesso (React Query fornece `isPending`/`isError` — UI nunca fica "cega").
- Colocação: componente específico de uma feature vive em `features/<modulo>/`; a base vem do **shadcn/ui** (`ui/`) — nunca recriar o que a biblioteca já entrega; estender sempre via variants/props, não por cópia.
- **shadcn/ui + Tailwind como padrão visual**: tema com design tokens (`globals.css`/`tailwind.config`), sem cores/sizes soltos no JSX (`bg-primary`, `text-muted-foreground` em vez de `text-gray-500` manual) — consistência entre as telas dos 3 integrantes.
- **Acessibilidade de graça**: componentes baseados em Radix UI (foco, teclado, ARIA) — refinamento sem esforço extra.
- Convenções fixas: componentes em PascalCase, hooks/objetos em camelCase, **um componente por arquivo**.
- Nenhuma string de rota/query solta: centralizadas em `queryKeys.ts` e constantes de rota.
- **ESLint + Prettier** configurados na Etapa 1 (antes da primeira tela) — código formatado igual pelos 3 integrantes.

---

## 17. Pendências

1. **Dados da capa**: nomes/RA dos 3 alunos e identificação exata do curso.
2. **Aprovação da proposta** (Etapa 0) pelo coordenador auxiliar.
3. **Confirmar com o professor** se exige algum recurso específico além do documento da APS.

> Nota: MAP_KEY da NASA FIRMS já configurada em `application.properties` e validada
> (endpoint retorna focos reais de GO). Item pendente removido.
