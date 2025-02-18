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
);

-- Criação da tabela "company"
CREATE TABLE network.company (
  idCompany SERIAL PRIMARY KEY,                                   -- [PK] Identificador único
  name VARCHAR(255) NOT NULL,                                     -- Nome completo da entidade
  address VARCHAR(255) NOT NULL,                                  -- Rua ou avenida
  city VARCHAR(255) NOT NULL,                                     -- Cidade
  country VARCHAR(100) NOT NULL,                                  -- País
  zipCode VARCHAR(20) NOT NULL,                                   -- Código postal
  email TEXT,                                                     -- Email da entidade
  contact TEXT,                                                   -- Contacto da entidade
  phone TEXT,                                                     -- Contacto da pessoa responsável
  website TEXT,                                                   -- Endereço Web
  createdDate TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,    -- Timestamp da criação
  lastModified TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL    -- Timestamp do último update
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
  isActive BOOLEAN DEFAULT true,                                  -- Estado (ativo/inativo)
  certificateId INTEGER,                                          -- [FK] Referência para o certificado
  companyId INTEGER,                                              -- [FK] Referência para a entidade
  CONSTRAINT fk_certificate
    FOREIGN KEY (certificateId)
    REFERENCES network.certificate (idCertificate)
    ON DELETE SET NULL,                                           -- Caso o certificado seja eliminado, retorna NULL
  CONSTRAINT fk_company
    FOREIGN KEY (companyId)
    REFERENCES network.company (idCompany)
    ON DELETE CASCADE                                             -- Caso a entidade seja eliminada, APs também serão apagados
);
