-- Criação do schema "network"
CREATE SCHEMA network;

-- Criação da tabela "certificate"
CREATE TABLE network.certificate (
  id SERIAL PRIMARY KEY,                                          -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome do certificado
  file_path TEXT NOT NULL,                                        -- Caminho para o certificado
  certificate_text TEXT,                                          -- Certificado em formato de texto    
  issue_date DATE NOT NULL,                                       -- Data de emissão
  issuer_url TEXT,                                                -- URL da entidade emissora
  issuer_name TEXT,                                               -- Entidade emissora
  certificate_data TEXT,                                          -- Dados para gerir certificados
  expiration_date DATE NOT NULL,                                  -- Data de validade ou expiração
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Data e hora da última atualização
  is_active BOOLEAN NOT NULL DEFAULT false,                       -- Estado de expiração (expirado/não-expirado)
  last_modified_user_id UUID,                                     -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_certificate_user
    FOREIGN KEY (last_modified_user_id)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
);

-- Criação da tabela "company"
CREATE TABLE network.company (
  id SERIAL PRIMARY KEY,                                          -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome completo da entidade
  address VARCHAR(255) NOT NULL,                                  -- Rua ou avenida
  city VARCHAR(100) NOT NULL,                                     -- Cidade
  country_id CHAR(2) NOT NULL,                                    -- [FK] País
  zip_code VARCHAR(20) NOT NULL,                                  -- Código postal
  email TEXT,                                                     -- Email da entidade
  contact TEXT,                                                   -- Contacto da entidade
  phone TEXT,                                                     -- Contacto da pessoa responsável
  website TEXT,                                                   -- Endereço Web
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,   -- Timestamp da criação
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Timestamp do último update
  last_modified_user_id UUID,                                     -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_company_user
    FOREIGN KEY (last_modified_user_id)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
  CONSTRAINT fk_company_country
    FOREIGN KEY (country_id)
    REFERENCES network.country(id)
    ON DELETE SET NULL;                                           -- Se o país for eliminado retorna NULL
);

-- Criação da tabela "accesspoint"
CREATE TABLE network.accesspoint (
  id SERIAL PRIMARY KEY,                                          -- [PK] Identificador único
  location_description VARCHAR(255) NOT NULL,                     -- Localização física
  ip_address INET NOT NULL,                                       -- Endereço IPv4/IPv6
  pmode XML,                                                      -- Configuração do PMode
  ap_software TEXT,                                               -- Software utilizado
  software_version TEXT,	                                        -- Versão do software
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,   -- Timestamp da criação
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Timestamp do último update
  is_active BOOLEAN NOT NULL DEFAULT true,                        -- Estado de ativação (ativo/inativo)
  certificate_id INTEGER,                                         -- [FK] Referência para o certificado
  company_id INTEGER,                                             -- [FK] Referência para a entidade
  last_modified_user_id UUID,                                     -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_certificate
    FOREIGN KEY (certificate_id)
    REFERENCES network.certificate (id)
    ON DELETE SET NULL,                                           -- Se o certificado for eliminado retorna NULL
  CONSTRAINT fk_company
    FOREIGN KEY (company_id)
    REFERENCES network.company (id)
    ON DELETE CASCADE,                                            -- Se a entidade for eliminada, AP será eliminado
  CONSTRAINT fk_access_point_user
    FOREIGN KEY (last_modified_user_id)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
);

-- Criação da tabela "country"
CREATE TABLE network.country (
  id CHAR(2) NOT NULL,                                            -- [PK] Código do país (ISO 3166-1 alpha-2)
  name VARCHAR(100),                                              -- Nome do país [inglês]
  country_code INTEGER NOT NULL                                   -- Código do número de telemóvel
  flag_url TEXT                                                   -- URL da bandeira
);

-- Criação das funções e triggers
CREATE OR REPLACE FUNCTION update_certificate_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiration_date < CURRENT_DATE THEN
      NEW.is_active := FALSE;
    ELSE
      NEW.is_active := TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER check_certificate_expiry
BEFORE UPDATE OR INSERT ON network.certificate
FOR EACH ROW
EXECUTE FUNCTION update_certificate_status();

-- Criação dos índices para as tabelas "certificate", "company" e "accessPoint"
CREATE INDEX idx_accessPoint_ip ON network.accessPoint(ip_address);
CREATE INDEX idx_accessPoint_company ON network.accessPoint(company_id);
CREATE INDEX idx_accessPoint_certificate ON network.accessPoint(certificate_id);
CREATE INDEX idx_company_name ON network.company(name);
CREATE INDEX idx_certificate_name ON network.certificate(name);
CREATE INDEX idx_certificate_file_path ON network.certificate(file_path);

-- Reniciar a sequência para as tabelas "certificate", "company" e "accessPoint"
SELECT setval('network.accesspoint_idaccesspoint_seq', 1, false);
SELECT setval('network.certificate_idcertificate_seq', 1, false);
SELECT setval('network.company_idcompany_seq', 1, false);

-- //////////////////////////////////////////////////////////////////////

-- Criação do schema "network"
CREATE SCHEMA status;

-- Criação da tabela "log_type"
CREATE TABLE status.log_type (
  id SERIAL PRIMARY KEY,                                          -- [PK] Identificador único
  type VARCHAR(50) NOT NULL,                                      -- Tipo de log
  description TEXT                                                -- Descrição do tipo de log
);

-- Criação da tabela "log"
CREATE TABLE status.log (
  id SERIAL PRIMARY KEY,                                          -- [PK] Identificador único
  type_id INTEGER NOT NULL,                                       -- [FK] Referência para o tipo de log
  message TEXT NOT NULL,                                          -- Mensagem do log
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,                    -- Timestamp do log
  metadata JSONB,                                                 -- Metadados adicionais
  CONSTRAINT fk_log_type
    FOREIGN KEY (type_id)
    REFERENCES status.log_type (id)
    ON DELETE CASCADE                                             -- Se o tipo de log for eliminado, os logs associados também serão
);