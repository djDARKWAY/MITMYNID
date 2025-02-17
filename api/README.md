# Projeto Base - API

## Requisitos

[Nodejs](https://nodejs.org/en)\
[Postgres](https://www.postgresql.org/)

## Instalação

1. Instalar dependências

```sh
    npm install
    npm install -g @loopback/cli
    npm install -g typescript
```

2. Base de dados

```sh
    # Criar schema e tabelas
    npm run migrate
```

Executar script na pasta `scripts\inserts\` para adicionar o utilizador administrador.\
Executar scripts na pasta `scripts\functions\`.

3. Start

```sh
    npm run start:dev
```

## Config base de dados

`src\datasources\db.datasource.ts`

```ts
...
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  schema: 'template'
...
```

## Documentação

[Loopback4](https://loopback.io/doc/en/lb4/index.html)

```sh
  # Criar model
  lb4 model

  # Criar repository
  lb4 repository

  # Criar controller
  lb4 controller

  # Adicionar relações entre tabelas
  lb4 relation
```

Adicionar propriedades da bd nos modelos

`src\models\...`

```ts
@model({
  settings: {
    strict: false,
    postgresql: {
      table: 'app_users_register', // Nome da tabela na db
    },
  }
})
```

```ts
...
    postgresql: {
      columnName: 'id', // Nome da coluna na bd
      dataType: 'UUID', // Tipo na bd
    },
...
```


Adicionar autenticação e restringir acesso aos endpoits nos controllers

`src\controllers\...`

```js
...
    @authenticate('jwt')
    @authorize({
    allowedRoles: ['ADMIN'], // Roles com acesso a endpoint
    voters: [basicAuthorization],
  })
...
```
