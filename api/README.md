# Projeto Base - API

## Requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)

## Instalação

1. **Instalar dependências**

   ```sh
   npm install
   npm install -g @loopback/cli
   npm install -g typescript
   ```

2. **Configurar a base de dados**

   ```sh
   # Criar schema e tabelas
   npm run migrate
   ```

   - Executar o script na pasta `scripts/inserts/` para adicionar o utilizador administrador.
   - Executar os scripts na pasta `scripts/functions/`.

3. **Iniciar o projeto**

   ```sh
   npm run start:dev
   ```

## Configuração da Base de Dados

Edite o ficheiro `src/datasources/db.datasource.ts` e configure as credenciais:

```ts
...
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  schema: 'template'
...
```

## Documentação

Para mais informações sobre a framework utilizada, consulte:

- [Loopback4](https://loopback.io/doc/en/lb4/index.html)

Comandos úteis:

```sh
# Criar um modelo
lb4 model

# Criar um repositório
lb4 repository

# Criar um controlador
lb4 controller

# Adicionar relações entre tabelas
lb4 relation
```

## Personalização (Opcional)

### 1. Configurar modelos da base de dados

Edite os ficheiros em `src/models/...` e adicione as propriedades da base de dados:

```ts
@model({
  settings: {
    strict: false,
    postgresql: {
      table: 'app_users_register', // Nome da tabela na base de dados
    },
  }
})
```

```ts
...
    postgresql: {
      columnName: 'id', // Nome da coluna na base de dados
      dataType: 'UUID', // Tipo de dado na base de dados
    },
...
```

### 2. Adicionar autenticação e restrição de acesso aos endpoints

Edite os controladores em `src/controllers/...` e adicione:

```ts
...
    @authenticate('jwt')
    @authorize({
    allowedRoles: ['ADMIN'], // Roles com acesso ao endpoint
    voters: [basicAuthorization],
  })
...
```
