# Como filtrar

## Como enviar um filtro para a API

Filtros são objetos usados dentro das funções de repositório mutação e listagem os quais ajudam a definir quais o registos são selecionados. Estes são enviados como parâmetro na URL e com o nome de `filter`. Antes de enviar o filtro verificar que o filtro está enconded.

Podemos chegar a esse resultado com a seguinte função:

```js

const filtter = {
    filter: JSON.stringify({
        where: { ...params.filter, [params.target]: params.id },
        offset: (params.pagination.page - 1) * params.pagination.perPage,
        limit: params.pagination.perPage,
        order: [`${params.sort.field} ${params.sort.order}`],
        include: aggregator.length > 0 ? aggregator : undefined,
    })
}

encodeURI(JSON.stringify(filter));
```

## Como receber um filtro na API

Filtros são recebidos da seguinte forma: 

```ts
@get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'],
    voters: [basicAuthorization],
  })
  async find(
    @param.filter(User) filter?: Filter<User> -----> filtro
  ): Promise<User[]> {
```

```ts
    @param.filter(TIPODAVARIVEL) filter?: Filter<TIPODAVARIVEL>
```