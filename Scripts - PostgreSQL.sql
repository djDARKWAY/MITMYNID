-- Criação do schema "network"
CREATE SCHEMA network;

-- Criação da tabela "certificate"
CREATE TABLE network.certificate (
  id_certificate SERIAL PRIMARY KEY,                              -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome do certificado
  file_path TEXT NOT NULL,                                        -- Caminho para o certificado
  certificate_text TEXT,                                          -- Certificado em formato de texto    
  issue_date DATE NOT NULL,                                       -- Data de emissão
  issuer_url TEXT,                                                -- URL da entidade emissora
  issuer_name TEXT,                                               -- Entidade emissora
  certificate_data TEXT,                                          -- Dados para gerir certificados
  expiration_date DATE NOT NULL,                                  -- Data de validade ou expiração
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Data e hora da última atualização
  is_expired BOOLEAN NOT NULL DEFAULT false,                      -- Estado de expiração (expirado/não-expirado)
  last_modified_user_id UUID,                                     -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_certificate_user
    FOREIGN KEY (last_modified_user_id)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
);

-- Criação da tabela "company"
CREATE TABLE network.company (
  id_company SERIAL PRIMARY KEY,                                  -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome completo da entidade
  address VARCHAR(255) NOT NULL,                                  -- Rua ou avenida
  city VARCHAR(100) NOT NULL,                                     -- Cidade
  country VARCHAR(60) NOT NULL,                                   -- País
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
);

-- Criação da tabela "accessPoint"
CREATE TABLE network.accessPoint (
  id_access_point SERIAL PRIMARY KEY,                             -- [PK] Identificador único
  location_description VARCHAR(255) NOT NULL,                     -- Localização física
  ip_address INET NOT NULL,                                       -- Endereço IPv4/IPv6
  configurations JSONB,                                           -- Configuração técnica em JSON
  permissions JSONB,                                              -- Permissões em JSON
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
    REFERENCES network.certificate (id_certificate)
    ON DELETE SET NULL,                                           -- Se o certificado for eliminado retorna NULL
  CONSTRAINT fk_company
    FOREIGN KEY (company_id)
    REFERENCES network.company (id_company)
    ON DELETE CASCADE,                                            -- Se a entidade for eliminada, AP será eliminado
  CONSTRAINT fk_access_point_user
    FOREIGN KEY (last_modified_user_id)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
);

-- Criação da função e trigger "update_certificate_status & check_certificate_expiry"
CREATE OR REPLACE FUNCTION update_certificate_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiration_date < CURRENT_DATE THEN
        NEW.is_expired := TRUE;
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

-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

-- Criação do schema "logs"
CREATE SCHEMA logs;

-- Criação da tabela "log_category"
CREATE TABLE logs.log_category (
    id_category SERIAL PRIMARY KEY,                               -- [PK] Identificador único da categoria
    name VARCHAR(255) NOT NULL,                                   -- Nome da categoria (ex: "Rede", "Login", etc.)
    description TEXT                                              -- Descrição da categoria
);

-- Criação da tabela "log_type"
CREATE TABLE logs.log_type (
    id_type SERIAL PRIMARY KEY,                                   -- [PK] Identificador único do tipo
    name VARCHAR(255) NOT NULL,                                   -- Nome do tipo de log (ex: "Aviso", "Erro", etc.)
    description TEXT                                              -- Descrição do tipo
);

-- Criação da tabela "log_entries"
CREATE TABLE logs.log_entries (
  id_log SERIAL PRIMARY KEY,                                      -- [PK] Identificador único
  cur_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,          -- Data, hora e fuso horário
  message TEXT,                                                   -- Mensagem principal
  details TEXT,                                                   -- Detalhes adicionais do log
  ip_address INET,                                                -- Endereço IP relacionado
  error_code INT,                                                 -- Código de erro
  url TEXT,                                                       -- URL relacionada ao log
  category_id INT NOT NULL,                                       -- [FK] Referência para a tabela "log_category"
  type_id INT NOT NULL,                                           -- [FK] Referência para a tabela "log_type"
  user_id UUID,                                                   -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES logs.log_category(id_category)
    ON DELETE CASCADE,                                            -- Se a categoria for eliminada, logs serão eliminados
  CONSTRAINT fk_type
    FOREIGN KEY (type_id)
    REFERENCES logs.log_type(id_type)
    ON DELETE CASCADE,                                            -- Se o tipo de log for eliminado, logs serão eliminados
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.app_users(id)
    ON DELETE SET NULL                                            -- Se o utilizador for eliminado retorna NULL
);
