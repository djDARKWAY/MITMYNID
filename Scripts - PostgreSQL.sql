-- Criação so schema "network"
CREATE SCHEMA network;

-- Criação da tabela "certificate"
CREATE TABLE network.certificate (
  idCertificate SERIAL PRIMARY KEY,                               -- [PK] dentificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome do certificado
  filePath TEXT NOT NULL,                                         -- Caminho para o certificado
  certificateText TEXT,                                           -- Certificado em formato de texto    
  issueDate DATE NOT NULL,                                        -- Data de emissão
  issuerUrl TEXT,                                                 -- URL da entidade emissora
  issuerName TEXT,                                                -- Entidade emissora
  certificateData TEXT,                                           -- Dados para gerir certificados
  expirationDate DATE NOT NULL,                                   -- Data de validade ou expiração
  lastModified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL    -- Data e hora da última atualização
  isExpired BOOLEAN DEFAULT false,                                -- Estado de expiração (expirado/não-expirado)
  lastModifiedUser UUID                                           -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_certificate_user
    FOREIGN KEY (lastModifiedUser)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL,                                           -- Se o utilizador for eliminado retorna NULL
);

-- Criação da tabela "company"
CREATE TABLE network.company (
  idCompany SERIAL PRIMARY KEY,                                   -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome completo da entidade
  address VARCHAR(255) NOT NULL,                                  -- Rua ou avenida
  city VARCHAR(100) NOT NULL,                                     -- Cidade
  country VARCHAR(60) NOT NULL,                                   -- País
  zipCode VARCHAR(20) NOT NULL,                                   -- Código postal
  email TEXT,                                                     -- Email da entidade
  contact TEXT,                                                   -- Contacto da entidade
  phone TEXT,                                                     -- Contacto da pessoa responsável
  website TEXT,                                                   -- Endereço Web
  createdDate TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,    -- Timestamp da criação
  lastModified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL    -- Timestamp do último update
  lastModifiedUser UUID                                           -- [FK] Referência para o utilizador

  CONSTRAINT fk_company_user
    FOREIGN KEY (lastModifiedUser)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL,                                           -- Se o utilizador for eliminado retorna NULL
);

-- Criação da tabela "accessPoint"
CREATE TABLE network.accessPoint (
  idAccessPoint SERIAL PRIMARY KEY,                               -- [PK] Identificador único
  locationDescription VARCHAR(255) NOT NULL,                      -- Localização física
  ipAddress INET NOT NULL,                                        -- Endereço IPv4/IPv6
  configurations JSONB,                                           -- Configuração técnica em JSON
  permissions JSONB,                                              -- Permissões em JSON
  apSoftware TEXT,                                                -- Software utilizado
  softwareVersion TEXT,	                                          -- Versão do software
  createdDate TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,    -- Timestamp da criação
  lastModified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,   -- Timestamp do último update
  isActive BOOLEAN DEFAULT true,                                  -- Estado de ativação (ativo/inativo)
  certificateId INTEGER,                                          -- [FK] Referência para o certificado
  companyId INTEGER,                                              -- [FK] Referência para a entidade
  lastModifiedUser UUID                                           -- [FK] Referência para o utilizador
  
  CONSTRAINT fk_certificate
    FOREIGN KEY (certificateId)
    REFERENCES network.certificate (idCertificate)
    ON DELETE SET NULL,                                           -- Se o certificado for eliminado retorna NULL
  CONSTRAINT fk_company
    FOREIGN KEY (companyId)
    REFERENCES network.company (idCompany)
    ON DELETE CASCADE                                             -- Se a entidade for eliminada, AP será eliminado
  CONSTRAINT fk_accesspoint_user
    FOREIGN KEY (lastModifiedUser)
    REFERENCES auth.app_users (id)
    ON DELETE SET NULL,                                           -- Se o utilizador for eliminado retorna NULL
);

-- Criação da função e trigger "update_certificate_status & check_certificate_expiry"
CREATE OR REPLACE FUNCTION update_certificate_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expirationDate < CURRENT_DATE THEN
        NEW.isExpired := TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER check_certificate_expiry
BEFORE UPDATE OR INSERT ON network.certificate
FOR EACH ROW
EXECUTE FUNCTION update_certificate_status();

-- Criação dos índices para as tabelas "certificate", "company" e "accessPoint"
CREATE INDEX idx_accessPoint_ip ON network.accessPoint("ipAddress")
CREATE INDEX idx_accessPoint_company ON network.accessPoint("companyid");
CREATE INDEX idx_accessPoint_certificate ON network.accessPoint("certificateid");
CREATE INDEX idx_company_name ON network.company("name");
CREATE INDEX idx_certificate_name ON network.certificate("name");
CREATE INDEX idx_certificate_filePath ON network.certificate("filePath");