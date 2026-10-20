# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Gestores Ambientais & Administradores (GO):** Profissionais responsáveis pelo controle de conformidade ISO 14001, acompanhamento de auditorias, renovação de licenças e governança de dados ambientais de empresas e órgãos em Goiás.
2. **Consultores & Auditores:** Técnicos ambientais que lançam medições de recursos (água, energia, emissões CO₂), inventário de resíduos e registram não conformidades.
3. **Órgão Regulador Estadual & Stakeholders:** Acompanhamento de indicadores de conformidade e relatórios oficiais.

## Product Purpose

SGAI-Go é o Sistema de Gestão Ambiental Integrado para o estado de Goiás, alinhado à norma ISO 14001. Seu propósito é centralizar a gestão ambiental de organizações goianas, permitindo controle proativo de aspectos e impactos ambientais, conformidade legal de licenças, inventário e destinação de resíduos, monitoramento contínuo de recursos (água, energia, pegada de carbono), tratamento de não conformidades com ações corretivas e integração com fontes públicas (NASA FIRMS para queimadas no Cerrado, Open-Meteo para qualidade do ar, IBGE para os 246 municípios goianos e BrasilAPI para validação cadastral de CNPJ).

## Positioning

Diferente de planilhas isoladas ou softwares genéricos de gestão, o SGAI-Go é construído sob medida para a realidade regulatória e geográfica de Goiás (Cerrado, 246 municípios IBGE, órgãos reguladores estaduais), integrando monitoramento em tempo real via WebSocket com dados públicos de satélite e sensores ambientais.

## Operating Context

- Operação em navegadores desktop em salas de controle, escritórios de gestão ambiental e auditoria de campo.
- Alta densidade de dados numéricos (m³, kWh, kg de CO₂, coordenadas geográficas, prazos de licenças, graus de significância ISO).
- Decisões críticas baseadas em prazos de validade (risco de embargo por licença vencida) e picos de emissão/queimadas.

## Capabilities and Constraints

- **Stack Frontend:** Next.js 16 (App Router), React 19, TypeScript estrito, Tailwind CSS v4, TanStack Query v5, Lucide Icons, Chart.js, React-Leaflet, Shadcn/UI (Base UI).
- **Backend:** Spring Boot 3.x REST API + WebSocket (STOMP) com JWT em cookies httpOnly e endpoints com prefixo `/api` e `/ws`.
- **Restrição de Acesso:** Perfis `ADMIN`, `GESTOR`, `CONSULTOR` (módulo de Usuários restrito a ADMIN).
- **Tratamento de Falhas:** Resiliência com fallback para indisponibilidade de APIs externas (NASA FIRMS, Open-Meteo).

## Brand Commitments

- **Nome Oficial:** SGAI-Go (Sistema de Gestão Ambiental Integrado — Goiás).
- **Acento e Identidade:** Esmeralda / Cerrado profundo (OKLCH croma 0.16–0.18, matiz 155°), transmitindo sustentabilidade institucional, tecnologia e rigor normativo.
- **Tom de Voz:** Técnico, preciso, institucional, objetivo (norma ISO 14001, ABNT, legislação ambiental de Goiás).

## Evidence on Hand

- Código-fonte completo de frontend em `web/` e backend Spring Boot em `api/`.
- Documentação formal acadêmica da APS e requisitos de conformidade ISO 14001 em `PLANO-DESENVOLVIMENTO.md`.
- Carga de dados inicial para os 246 municípios de Goiás e dados de demonstração em `db/init/`.

## Product Principles

1. **Clareza Operacional e Densidade Informativa:** O operador ambiental deve identificar alertas, licenças críticas e desvios num relance de 3 segundos.
2. **Consistência Normativa (ISO 14001):** Terminologia, cálculos (F×G×P), gravidades e fluxos de auditoria devem seguir rigorosamente os padrões técnicos internacionais.
3. **Elegância Institucional Moderna:** Interface com acabamento de produto SaaS enterprise de classe mundial, afastando qualquer aspecto amador ou de protótipo inacabado.
4. **Feedback Imediato e Confiabilidade:** Estados de loading (skeletons), feedback de ações (toasts), confirmações em modais/drawers e atualização em tempo real sem travar a navegação.
