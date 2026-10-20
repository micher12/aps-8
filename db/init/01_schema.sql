-- SGAI-Go · 01_schema.sql
-- Modelo do banco (PostgreSQL 16). Executado automaticamente pelo Docker (db/init).

CREATE TABLE municipios_go (
    codigo_ibge   INT PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios (
    id            BIGSERIAL PRIMARY KEY,
    nome          VARCHAR(120) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    senha_hash    VARCHAR(100) NOT NULL,
    perfil        VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'GESTOR', 'CONSULTOR')),
    ativo         BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE organizacoes (
    id            BIGSERIAL PRIMARY KEY,
    razao_social  VARCHAR(200) NOT NULL,
    cnpj          VARCHAR(14) UNIQUE,
    setor         VARCHAR(80),
    porte         VARCHAR(20) CHECK (porte IN ('MEI','ME','EPP','MEDIO','GRANDE')),
    municipio_id  INT REFERENCES municipios_go(codigo_ibge),
    logradouro    VARCHAR(200),
    cep           VARCHAR(8),
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    ativo         BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE gestor_organizacao (
    usuario_id      BIGINT NOT NULL REFERENCES usuarios(id),
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    PRIMARY KEY (usuario_id, organizacao_id)
);

CREATE TABLE aspectos_impactos (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    descricao       VARCHAR(300) NOT NULL,
    tipo            VARCHAR(30) NOT NULL CHECK (tipo IN
        ('RESIDUO','EFLUENTE','EMISSAO','CONSUMO_AGUA','CONSUMO_ENERGIA','SOLO','RUIDO','OUTRO')),
    impacto         VARCHAR(300) NOT NULL,
    frequencia      SMALLINT NOT NULL CHECK (frequencia BETWEEN 1 AND 5),
    gravidade       SMALLINT NOT NULL CHECK (gravidade BETWEEN 1 AND 5),
    probabilidade   SMALLINT NOT NULL CHECK (probabilidade BETWEEN 1 AND 5),
    -- grau de significância ISO 14001 = frequencia * gravidade * probabilidade
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE residuos (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    tipo            VARCHAR(120) NOT NULL,
    classe          VARCHAR(20) NOT NULL CHECK (classe IN ('PERIGOSO','NAO_PERIGOSO','INFECTANTE')),
    quantidade      NUMERIC(12,2) NOT NULL CHECK (quantidade > 0),
    unidade         VARCHAR(10) NOT NULL DEFAULT 'kg',
    destinacao      VARCHAR(120) NOT NULL,
    destinatario    VARCHAR(200),
    data_registro   DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE licencas_ambientais (
    id               BIGSERIAL PRIMARY KEY,
    organizacao_id   BIGINT NOT NULL REFERENCES organizacoes(id),
    numero           VARCHAR(40) NOT NULL,
    tipo             VARCHAR(40) NOT NULL, -- LP, LI, LO, LAS etc.
    orgao_emissor    VARCHAR(120) NOT NULL DEFAULT 'IMASUL',
    data_emissao     DATE NOT NULL,
    data_validade    DATE NOT NULL,
    observacao       TEXT,
    criado_em        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE monitoramentos (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('AGUA','ENERGIA','CO2')),
    valor           NUMERIC(14,3) NOT NULL CHECK (valor >= 0),
    unidade         VARCHAR(12) NOT NULL,
    data_medicao    DATE NOT NULL,
    observacao      VARCHAR(300),
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE metas_indicadores (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('AGUA','ENERGIA','CO2')),
    meta_mensal     NUMERIC(14,3) NOT NULL CHECK (meta_mensal > 0),
    ano             SMALLINT NOT NULL
);

CREATE TABLE nao_conformidades (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    descricao       VARCHAR(400) NOT NULL,
    origem          VARCHAR(40) NOT NULL DEFAULT 'AUDITORIA_INTERNA',
    gravidade       VARCHAR(15) NOT NULL CHECK (gravidade IN ('BAIXA','MEDIA','ALTA','CRITICA')),
    status          VARCHAR(20) NOT NULL DEFAULT 'ABERTA'
        CHECK (status IN ('ABERTA','EM_TRATAMENTO','RESOLVIDA')),
    data_abertura   DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE acoes_corretivas (
    id                    BIGSERIAL PRIMARY KEY,
    nao_conformidade_id   BIGINT NOT NULL REFERENCES nao_conformidades(id) ON DELETE CASCADE,
    descricao             VARCHAR(400) NOT NULL,
    responsavel           VARCHAR(120) NOT NULL,
    prazo                 DATE,
    status                VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
        CHECK (status IN ('PENDENTE','EM_ANDAMENTO','CONCLUIDA')),
    criado_em             TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE stakeholders (
    id              BIGSERIAL PRIMARY KEY,
    organizacao_id  BIGINT NOT NULL REFERENCES organizacoes(id),
    nome            VARCHAR(150) NOT NULL,
    categoria       VARCHAR(30) NOT NULL CHECK (categoria IN
        ('COLABORADOR','FORNECEDOR','COMUNIDADE','ORGAO_PUBLICO','INVESTIDOR','OUTRO')),
    contato         VARCHAR(150),
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE logs_auditoria (
    id         BIGSERIAL PRIMARY KEY,
    usuario    VARCHAR(150),
    entidade   VARCHAR(60) NOT NULL,
    acao       VARCHAR(10) NOT NULL,
    descricao  VARCHAR(400),
    criado_em  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_org_municipio        ON organizacoes(municipio_id);
CREATE INDEX idx_aspectos_org         ON aspectos_impactos(organizacao_id);
CREATE INDEX idx_residuos_org         ON residuos(organizacao_id);
CREATE INDEX idx_residuos_data        ON residuos(data_registro);
CREATE INDEX idx_licencas_org         ON licencas_ambientais(organizacao_id);
CREATE INDEX idx_licencas_validade    ON licencas_ambientais(data_validade);
CREATE INDEX idx_monitor_org_data     ON monitoramentos(organizacao_id, data_medicao);
CREATE INDEX idx_nc_org               ON nao_conformidades(organizacao_id);
CREATE INDEX idx_nc_status            ON nao_conformidades(status);
