-- SGAI-Go · 03_carga_demo.sql — dados de demonstração realistas
-- Senha de todos os usuários demo: senha123 (BCrypt)
-- Bases reais usadas: SEMAD-GO (Lei 20.694/2019, Decreto 9.710/2020, sistema IPÊ),
-- SINIR/MTR (Portaria MMA 280/2020), ABNT NBR 10004 (Classe I / II-A / II-B),
-- CONAMA 430/2011 (efluentes), ANVISA RDC 222/2018 (resíduos de saúde),
-- NBR 10151 (ruído). CNPJs fictícios com DV válido; o da Prefeitura é público.
-- IDs 1–5 de organizações e 1–9 de NCs são posicionais (banco recém-criado).

INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
  ('Michel', 'michelasm3@gmail.com', '$2y$10$0Gp/57On2rzoSwNj1a74oemnbE1GNNHDLdv98pMtEa5qXlAUvcqzC', 'ADMIN'),
  ('admin', 'admin@sgaigo.com.br', '$2y$10$0Gp/57On2rzoSwNj1a74oemnbE1GNNHDLdv98pMtEa5qXlAUvcqzC', 'ADMIN'),
  ('Gustavo Henrique Lima', 'gestor@sgaigo.com.br', '$2y$10$0Gp/57On2rzoSwNj1a74oemnbE1GNNHDLdv98pMtEa5qXlAUvcqzC', 'GESTOR'),
  ('Carla Mendes Ribeiro', 'consultor@sgaigo.com.br', '$2y$10$0Gp/57On2rzoSwNj1a74oemnbE1GNNHDLdv98pMtEa5qXlAUvcqzC', 'CONSULTOR');

INSERT INTO organizacoes (razao_social, cnpj, setor, porte, municipio_id, logradouro, cep, latitude, longitude) VALUES
  ('Cerâmica São José Ltda',                    '04215778000179', 'Indústria cerâmica',        'MEDIO',  5208707, 'Rua P-20, Qd. 63, Lt. 08, Vila João Vaz',        '74443460', -16.6732, -49.2831),
  ('Cooperativa Agro do Vale do Rio Verde',     '02438105000152', 'Agroindústria e armazenagem','GRANDE', 5218805, 'Rod. BR-060, km 378, Zona Rural',               '75901970', -17.7892, -50.9255),
  ('Prefeitura Municipal de Anápolis',          '01067479000146', 'Poder Público',             'GRANDE', 5201108, 'Av. Brasil, 200, Centro',                     '75020900', -16.3281, -48.9530),
  ('Hospital São Judas de Goianésia Ltda',      '11902334000177', 'Saúde',                     'MEDIO',  5208608, 'Rua 9, 250, Centro',                          '76380000', -15.3146, -49.1195),
  ('Goiás Atacadista e Distribuidor Ltda',      '28445913000130', 'Comércio atacadista',       'GRANDE', 5201405, 'Av. Rio Verde, 5555, Vila Brasília',           '74905450', -16.8213, -49.2313);

INSERT INTO gestor_organizacao (usuario_id, organizacao_id)
SELECT 2, id FROM organizacoes;

-- Licenças: cobre VENCIDA (-12d), vencendo em 8d e 26d, médio (~140d) e longas.
INSERT INTO licencas_ambientais (organizacao_id, numero, tipo, orgao_emissor, data_emissao, data_validade, observacao) VALUES
  (1, 'LO 184/2022',    'LO',      'SEMAD-GO',                  '2022-08-15', CURRENT_DATE + INTERVAL '8 days',   'Fabricação de cerâmica vermelha. Renovação requerida com 120 dias de antecedência (Decreto 9.710/2020). Condicionante: relatório anual de cinzas do forno.'),
  (1, 'LP 076/2025',    'LP',      'SEMAD-GO',                  '2025-06-20', CURRENT_DATE + INTERVAL '900 days',  'Ampliação – forno 3 a biomassa. Prévia: não autoriza instalação nem operação.'),
  (2, 'LAU 091/2024',   'LAU',     'SEMAD-GO',                  '2024-04-10', CURRENT_DATE + INTERVAL '26 days',   'Armazenagem e secagem de grãos. Condicionante 04: comprovar devolução de embalagens ao INPEV com CDF.'),
  (2, 'OUTORGA 118/2023','OUTORGA','SEMAD-GO / SECIMA',          '2023-03-02', CURRENT_DATE + INTERVAL '400 days',  'Captação subterrânea – 2 poços (lavagem e utilidades). Vazão outorgada 8 m³/h.'),
  (3, 'LO 322/2021',    'LO',      'SEMMA Anápolis',            '2021-11-30', CURRENT_DATE + INTERVAL '140 days',  'Limpeza urbana e operação da ETE do distrito. Condicionante: campanhas trimestrais de DBO/DQO (CONAMA 430/2011).'),
  (4, 'LO 045/2021',    'LO',      'SEMAD-GO',                  '2021-02-01', CURRENT_DATE - INTERVAL '12 days',   'VENCIDA – processo de renovação nº 2025/8841 em análise; operar sob protocolo até decisão.'),
  (4, 'LAS 312/2024',   'LAS',     'SEMAD-GO',                  '2024-09-12', CURRENT_DATE + INTERVAL '700 days',  'Gerador de emergência 500 kVA + abrigo de resíduos infectantes (RDC ANVISA 222/2018).'),
  (5, 'LO 210/2023',    'LO',      'SEMMA Aparecida de Goiânia','2023-07-18', CURRENT_DATE + INTERVAL '580 days',  'Atacadista com câmaras frias. Condicionante: plano de detecção de vazamento de fluido refrigerante.');

-- Não conformidades: todas as organizações, todos os status e gravidades.
INSERT INTO nao_conformidades (organizacao_id, descricao, origem, gravidade, status, data_abertura) VALUES
  (1, 'Bacia de contenção do tanque de óleo diesel (2.000 L) sem impermeabilização e sem kit de emergência — risco de contaminação do solo (NBR 17505).', 'AUDITORIA_INTERNA', 'CRITICA', 'EM_TRATAMENTO', '2026-09-02'),
  (1, 'Auto de fiscalização SEMAD-GO nº 2026/4412: pilha de cinza de forno a céu aberto, sem cobertura e sem canaleta de drenagem.', 'FISCALIZACAO', 'ALTA', 'ABERTA', '2026-10-05'),
  (2, 'MTRs de embalagens vazias de agrotóxicos de jun/2026 sem baixa/CDF no SINIR há 45 dias (Portaria MMA 280/2020).', 'AUDITORIA_INTERNA', 'MEDIA', 'RESOLVIDA', '2026-07-20'),
  (3, 'ETE do distrito: DBO do efluente em 78 mg/L, acima do limite CONAMA 430/2011 (60 mg/L) em duas campanhas seguidas.', 'MONITORAMENTO', 'MEDIA', 'EM_TRATAMENTO', '2026-08-14'),
  (3, 'Ouvidoria nº 8821: coleta seletiva da Praça Central sem segregação nem sinalização; recicláveis misturados ao comum.', 'RECLAMACAO', 'BAIXA', 'ABERTA', '2026-10-01'),
  (4, 'Abrigo de resíduos infectantes (Grupos A/E – RDC ANVISA 222/2018) sem pesagem diária e sem emissão de MTR em 3 dias da semana 38.', 'AUDITORIA_EXTERNA', 'CRITICA', 'EM_TRATAMENTO', '2026-09-18'),
  (4, 'VISA municipal: revelador de RX armazenado junto a perfurocortantes, sem FISPQ e sem contenção secundária.', 'FISCALIZACAO', 'ALTA', 'ABERTA', '2026-10-08'),
  (5, 'Câmara fria 02 com vazamento de fluido R-404A sem registro de recarga nem teste de estanqueidade.', 'AUDITORIA_INTERNA', 'MEDIA', 'RESOLVIDA', '2026-06-30'),
  (5, 'Ruído de docas após 22h medido em 58 dB(A) — acima do limite noturno de 55 dB(A) da NBR 10151 em zona mista; 2 reclamações de vizinhos.', 'RECLAMACAO', 'BAIXA', 'EM_TRATAMENTO', '2026-09-25');

-- Ações corretivas (NCs 1–9 na ordem de inserção acima).
INSERT INTO acoes_corretivas (nao_conformidade_id, descricao, responsavel, prazo, status) VALUES
  (1, 'Impermeabilizar bacia de contenção do diesel e adquirir 2 kits de emergência (manta, turfa, EPI).', 'Robson Teles — Eng. Segurança', '2026-11-15', 'EM_ANDAMENTO'),
  (1, 'Publicar SOP-AMB-014 de armazenagem de combustíveis e treinar equipe da utilidade.', 'Ana Paula Souza — SGI', '2026-10-30', 'PENDENTE'),
  (2, 'Cobrir pilha de cinzas com lona e executar canaleta de drenagem conforme croqui da SEMAD.', 'Robson Teles — Eng. Segurança', '2026-10-25', 'EM_ANDAMENTO'),
  (3, 'Baixar MTRs pendentes no SINIR e cobrar CDF do destinador; criar rotina semanal de conciliação MTR × CDF.', 'Gustavo H. Lima — Gestor Ambiental', '2026-08-10', 'CONCLUIDA'),
  (4, 'Ajustar dosagem de coagulante e limpar decantador da ETE; repetir campanha de DBO em 15 dias.', 'Márcia Duarte — Operação ETE', '2026-11-05', 'EM_ANDAMENTO'),
  (5, 'Instalar 6 placas de segregação e 4 contentores coloridos (Res. CONAMA 275) na Praça Central.', 'Carla M. Ribeiro — Consultora', '2026-10-20', 'EM_ANDAMENTO'),
  (6, 'Implantar pesagem diária do infectante com balança calibrada e emissão de MTR no ato da coleta.', 'Enf. Patrícia Nunes — SCIH', '2026-10-22', 'EM_ANDAMENTO'),
  (6, 'Contratar coleta extraordinária e autoclave dedicada para zerar o passivo do abrigo.', 'Diretoria Administrativa', '2026-10-12', 'CONCLUIDA'),
  (7, 'Segregar revelador para abrigo químico com contenção secundária e afixar FISPQ; cotar recuperação de prata.', 'Farm. Diego Alvarenga', '2026-10-28', 'PENDENTE'),
  (8, 'Reparo do vazamento da câmara 02, recarga com nota e teste de estanqueidade com laudo.', 'Manutenção — João P. Faria', '2026-07-25', 'CONCLUIDA'),
  (9, 'Restringir docas após 22h a 1 portão e instalar barreira acústica; medir ruído por 7 noites.', 'Gerente de Loja — Sílvio Prado', '2026-10-30', 'EM_ANDAMENTO'),
  (9, 'Comunicar plano de ação aos vizinhos via associação de moradores e registrar na ouvidoria.', 'Carla M. Ribeiro — Consultora', '2026-10-18', 'PENDENTE');

-- Partes interessadas por organização.
INSERT INTO stakeholders (organizacao_id, nome, categoria, contato) VALUES
  (1, 'Associação de Moradores do Jardim Guanabara', 'COMUNIDADE',   'contato@amjguanabara.org.br'),
  (1, 'SEMAD-GO – Superintendência de Licenciamento', 'ORGAO_PUBLICO', '(62) 3201-5200'),
  (1, 'Ecopetro Soluções Ambientais (transportador)',  'FORNECEDOR',   '(62) 3598-0218'),
  (2, 'Central INPEV de Recebimento – Rio Verde',     'FORNECEDOR',   '(64) 3621-4400'),
  (2, 'Sindicato Rural de Rio Verde',                  'OUTRO',        '(64) 3620-1500'),
  (2, 'Corpo de Bombeiros – 4º BBM Rio Verde',        'ORGAO_PUBLICO','(64) 3621-1900'),
  (3, 'Conselho Comunitário de Anápolis',              'COMUNIDADE',   'conselho@anapolismais.org'),
  (3, 'SANEAGO – Regional Anápolis',                   'FORNECEDOR',   '0800 645 0115'),
  (3, 'Ministério Público-GO – Promotoria de Anápolis','ORGAO_PUBLICO','(62) 3328-2000'),
  (4, 'Vigilância Sanitária de Goianésia',             'ORGAO_PUBLICO','(62) 3389-2100'),
  (4, 'Comissão de Controle de Infecção (CCIH) – colaboradores', 'COLABORADOR', 'ccih@hsaojudas.com.br'),
  (4, 'Stericycle Gestão Ambiental GO (coleta infectante)', 'FORNECEDOR', '(62) 3291-7700'),
  (5, 'Associação de Moradores da Vila Brasília',      'COMUNIDADE',   '(62) 3248-9900'),
  (5, 'Cooperativa de Catadores COOPERCAT Aparecida',  'FORNECEDOR',   'comercial@coopercat.org.br'),
  (5, 'Grupo de investidores – Fundo Leste Participações', 'INVESTIDOR', 'ri@fundoleste.com.br');

-- Aspectos e impactos (ISO 14001, significância = F × G × P).
INSERT INTO aspectos_impactos (organizacao_id, descricao, tipo, impacto, frequencia, gravidade, probabilidade) VALUES
  (1, 'Queima de biomassa (cavaco/lenha) nos fornos', 'EMISSAO', 'Poluição do ar (MP e fumaça) e incômodo à vizinhança', 5, 4, 4),
  (1, 'Extração e transporte de argila do pátio', 'SOLO', 'Degradação do solo e assoreamento em chuva forte', 4, 4, 3),
  (1, 'Consumo de água na linha de extrusão e resfriamento', 'CONSUMO_AGUA', 'Pressão sobre o abastecimento local no período seco', 4, 3, 3),
  (1, 'Ruído dos marombas e empilhadeiras no pátio', 'RUIDO', 'Incômodo à vizinhança e exposição ocupacional', 4, 2, 3),
  (2, 'Aplicação e armazenagem de agrotóxicos no barracão', 'SOLO', 'Contaminação do solo e da água subterrânea por deriva/vazamento', 3, 5, 3),
  (2, 'Secagem de grãos (queimadores a lenha) na safra', 'CONSUMO_ENERGIA', 'Emissão de MP/CO e consumo intensivo de biomassa', 3, 4, 4),
  (2, 'Lavagem de máquinas e pista no pátio', 'EFLUENTE', 'Efluente oleoso para a caixa separadora; risco ao córrego', 4, 3, 3),
  (2, 'Embalagens vazias de agrotóxicos (tríplice lavagem)', 'RESIDUO', 'Passivo tóxico se não devolvido ao INPEV', 3, 5, 2),
  (3, 'Efluente da ETE do distrito lançado no riacho', 'EFLUENTE', 'Eutrofização e mortandade de peixes se DBO estourar', 4, 5, 3),
  (3, 'Varrição e poda urbana (resíduos verdes)', 'RESIDUO', 'Entupimento de bocas de lobo e descarte irregular', 5, 3, 3),
  (3, 'Frota de coleta (diesel) circulando na cidade', 'EMISSAO', 'Emissão de CO₂/NOx e ruído em rotas residenciais', 5, 3, 4),
  (4, 'Geração de resíduos infectantes (Grupos A/E)', 'RESIDUO', 'Contaminação cruzada e risco biológico a trabalhadores', 5, 5, 4),
  (4, 'Lavanderia hospitalar 24h (água quente e químicos)', 'CONSUMO_AGUA', 'Alto consumo de água e efluente com carga orgânica', 5, 3, 4),
  (4, 'Gerador a diesel em testes semanais e blecautes', 'EMISSAO', 'Emissão de NOx/MP e ruído em área sensível', 2, 3, 3),
  (5, 'Câmaras frias (energia + fluido R-404A)', 'CONSUMO_ENERGIA', 'Alto consumo elétrico e potencial vazamento de GEE', 5, 4, 3),
  (5, 'Quebra de hortifrúti e comida da praça de alimentação', 'RESIDUO', 'Desperdício e chorume se segregação falhar', 5, 3, 4),
  (5, 'Movimentação de docas e carretas à noite', 'RUIDO', 'Ultrapassagem do limite noturno NBR 10151', 3, 2, 3);

-- Metas mensais 2026 por organização (propositalmente ~5% abaixo da média histórica:
-- alguns meses estouram e alimentam o dashboard).
INSERT INTO metas_indicadores (organizacao_id, tipo, meta_mensal, ano) VALUES
  (1, 'AGUA',    950, 2026), (1, 'ENERGIA', 46000, 2026), (1, 'CO2', 21000, 2026),
  (2, 'AGUA',    600, 2026), (2, 'ENERGIA', 24000, 2026), (2, 'CO2', 11000, 2026),
  (3, 'AGUA',   2300, 2026), (3, 'ENERGIA', 17500, 2026), (3, 'CO2',  5800, 2026),
  (4, 'AGUA',   1850, 2026), (4, 'ENERGIA', 59000, 2026), (4, 'CO2',  8900, 2026),
  (5, 'AGUA',    680, 2026), (5, 'ENERGIA', 90000, 2026), (5, 'CO2', 12800, 2026);

-- Monitoramentos jan–out/2026 com perfil próprio por organização e sazonalidade do
-- Cerrado (seca mai–set eleva água/poeira; calor set–out eleva refrigeração; safra
-- fev–jul eleva energia da cooperativa). Variação aleatória de ±6% ao redor da base.
INSERT INTO monitoramentos (organizacao_id, tipo, valor, unidade, data_medicao)
SELECT b.org, m.tipo,
       ROUND((b.base::float8 * (1 + b.saz::float8 * SIN((EXTRACT(MONTH FROM d.dia) - 1) * 0.52) + (random() - 0.5) * 0.12))::numeric, 2),
       m.un, d.dia
FROM (VALUES
  (1::bigint, 'AGUA',     980::numeric,   0.06), (1, 'ENERGIA', 48000,  0.04), (1, 'CO2', 22500,  0.05),
  (2, 'AGUA',     640,  0.10), (2, 'ENERGIA', 26000,  0.16), (2, 'CO2', 11800,  0.12),
  (3, 'AGUA',    2450,  0.08), (3, 'ENERGIA', 18500,  0.05), (3, 'CO2',  6200,  0.05),
  (4, 'AGUA',    1950,  0.05), (4, 'ENERGIA', 62000,  0.05), (4, 'CO2',  9400,  0.05),
  (5, 'AGUA',     720,  0.07), (5, 'ENERGIA', 95000,  0.08), (5, 'CO2', 13500,  0.06)
) AS b(org, tipo, base, saz)
JOIN (VALUES ('AGUA','m3'),('ENERGIA','kWh'),('CO2','kg')) AS m(tipo, un) ON m.tipo = b.tipo
CROSS JOIN generate_series('2026-01-01'::date, '2026-10-01'::date, interval '1 month') AS d(dia);

-- Pico de safra da cooperativa (fev–mar e jun–jul): energia e CO₂ ~35% acima da base.
UPDATE monitoramentos mo SET valor = ROUND(mo.valor * 1.35, 2)
FROM (VALUES ('ENERGIA'), ('CO2')) AS t(tipo)
WHERE mo.organizacao_id = 2 AND mo.tipo = t.tipo
  AND EXTRACT(MONTH FROM mo.data_medicao) IN (2, 3, 6, 7);

-- Resíduos jan–out/2026 por perfil de cada organização (quantidade com ±10% aleatório).
-- Org 1 — cerâmica: caco refratário, cinza de biomassa, óleo usado, embalagem contaminada.
INSERT INTO residuos (organizacao_id, tipo, classe, quantidade, unidade, destinacao, destinatario, data_registro)
SELECT 1, r.tipo, r.classe, ROUND((r.qtd::float8 * (1 + (random() - 0.5) * 0.2))::numeric, 2), r.un, r.destinacao, r.destinatario, d.dia
FROM (VALUES
  ('Caco cerâmico e refratário',      'NAO_PERIGOSO', 2800::numeric, 'kg', 'Coprocessamento', 'Cimenteira Tocantins – Cezarina/GO'),
  ('Cinza de forno a biomassa',       'NAO_PERIGOSO', 1400, 'kg', 'Coprocessamento', 'Cimenteira Tocantins – Cezarina/GO'),
  ('Óleo lubrificante usado',         'PERIGOSO',      120, 'L',  'Rerrefino',       'Ecopetro Soluções Ambientais – Aparecida de Goiânia'),
  ('Embalagens contaminadas c/ óleo', 'PERIGOSO',       85, 'kg', 'Coprocessamento', 'Ecopetro Soluções Ambientais – Aparecida de Goiânia')
) AS r(tipo, classe, qtd, un, destinacao, destinatario)
CROSS JOIN generate_series('2026-01-28'::date, '2026-10-01'::date, interval '1 month') AS d(dia);

-- Org 2 — cooperativa agro: embalagens de agrotóxicos (INPEV), óleo, varredura, sucata.
INSERT INTO residuos (organizacao_id, tipo, classe, quantidade, unidade, destinacao, destinatario, data_registro)
SELECT 2, r.tipo, r.classe, ROUND((r.qtd::float8 * (1 + (random() - 0.5) * 0.2))::numeric, 2), r.un, r.destinacao, r.destinatario, d.dia
FROM (VALUES
  ('Embalagens vazias de agrotóxicos', 'PERIGOSO',     320::numeric, 'kg', 'Logística reversa', 'INPEV – Central Rio Verde'),
  ('Óleo lubrificante usado (frota)',  'PERIGOSO',     220, 'L',  'Rerrefino',       'Ecopetro Soluções Ambientais – Aparecida de Goiânia'),
  ('Resíduo de grãos e varredura',     'NAO_PERIGOSO',1800, 'kg', 'Compostagem',     'Fazendas associadas – Rio Verde'),
  ('Sucata metálica de implementos',   'NAO_PERIGOSO', 450, 'kg', 'Reciclagem',      'Gerdau Reciclagem – Goiânia')
) AS r(tipo, classe, qtd, un, destinacao, destinatario)
CROSS JOIN generate_series('2026-01-28'::date, '2026-10-01'::date, interval '1 month') AS d(dia);

-- Org 3 — prefeitura: poda, entulho, lâmpadas (Reciclus), papel administrativo.
INSERT INTO residuos (organizacao_id, tipo, classe, quantidade, unidade, destinacao, destinatario, data_registro)
SELECT 3, r.tipo, r.classe, ROUND((r.qtd::float8 * (1 + (random() - 0.5) * 0.2))::numeric, 2), r.un, r.destinacao, r.destinatario, d.dia
FROM (VALUES
  ('Poda urbana e roçagem',        'NAO_PERIGOSO', 6500::numeric, 'kg', 'Compostagem',       'Pátio de compostagem municipal – Anápolis'),
  ('Entulho de construção (RCD)',  'NAO_PERIGOSO', 4200, 'kg', 'Reciclagem',        'ATT Entulho Limpo – Anápolis'),
  ('Lâmpadas fluorescentes',       'PERIGOSO',      180, 'un', 'Logística reversa', 'Reciclus – ponto Anápolis'),
  ('Papel e papelão administrativo','NAO_PERIGOSO', 900, 'kg', 'Reciclagem',        'COOPERCAT – parceira Anápolis')
) AS r(tipo, classe, qtd, un, destinacao, destinatario)
CROSS JOIN generate_series('2026-01-28'::date, '2026-10-01'::date, interval '1 month') AS d(dia);

-- Org 4 — hospital: infectante A/E, perfurocortante, químico de RX, comum reciclável.
INSERT INTO residuos (organizacao_id, tipo, classe, quantidade, unidade, destinacao, destinatario, data_registro)
SELECT 4, r.tipo, r.classe, ROUND((r.qtd::float8 * (1 + (random() - 0.5) * 0.2))::numeric, 2), r.un, r.destinacao, r.destinatario, d.dia
FROM (VALUES
  ('Resíduo infectante – Grupos A/E', 'INFECTANTE',   950::numeric, 'kg', 'Incineração',       'Stericycle Gestão Ambiental – Goiânia'),
  ('Perfurocortantes (caixa rígida)', 'INFECTANTE',   120, 'kg', 'Incineração',       'Stericycle Gestão Ambiental – Goiânia'),
  ('Revelador e fixador de RX',       'PERIGOSO',      60, 'L',  'Recuperação/Incineração', 'Ecopetro Soluções Ambientais – Aparecida de Goiânia'),
  ('Comum reciclável (papel/plástico)', 'NAO_PERIGOSO', 1100, 'kg', 'Reciclagem',      'Cooperativa Renascer – Goianésia')
) AS r(tipo, classe, qtd, un, destinacao, destinatario)
CROSS JOIN generate_series('2026-01-28'::date, '2026-10-01'::date, interval '1 month') AS d(dia);

-- Org 5 — atacadista: papelão, filme plástico, orgânico de quebra, óleo de fritura.
INSERT INTO residuos (organizacao_id, tipo, classe, quantidade, unidade, destinacao, destinatario, data_registro)
SELECT 5, r.tipo, r.classe, ROUND((r.qtd::float8 * (1 + (random() - 0.5) * 0.2))::numeric, 2), r.un, r.destinacao, r.destinatario, d.dia
FROM (VALUES
  ('Papelão de caixas',            'NAO_PERIGOSO', 3200::numeric, 'kg', 'Reciclagem',  'Recicla Goiás – COOPERCAT Aparecida'),
  ('Plástico filme (stretch)',     'NAO_PERIGOSO',  850, 'kg', 'Reciclagem',  'Recicla Goiás – COOPERCAT Aparecida'),
  ('Orgânico de quebra (FLV)',     'NAO_PERIGOSO', 1400, 'kg', 'Compostagem', 'Composta Aparecida – horta comunitária'),
  ('Óleo de fritura (praça)',      'NAO_PERIGOSO',  180, 'L',  'Biodiesel',   'BioÓleo Cerrado – Senador Canedo')
) AS r(tipo, classe, qtd, un, destinacao, destinatario)
CROSS JOIN generate_series('2026-01-28'::date, '2026-10-01'::date, interval '1 month') AS d(dia);
