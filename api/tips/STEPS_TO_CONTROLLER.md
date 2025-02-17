# Novo Controlador

## IMPORTANTE - Antes de seguir estes passos verificar que o datasource está definido e operacional

=======================================================================

## Passo 1 - Criação do modelo

"Models" são o tipo de ficheiro que o loopback usa exportar/importar tabelas da base dados. Este tipo de ficheiro pode ser encontrado no seguinte caminho: `loopback/src/models`.

Para criar um model basta inserir o seguinte comando no "root" da pasta loopback:

**NOTA:**  Este tipo de comandos não pode ser executado no powershell sem algumas configurações previamente feitas.

```txt
lb4 model
```

De seguida a interface irá pedir algumas informações necessárias para a crição do model, tais como o seu nome, a classe base de modelo, e se o modelo é de formato livre, por outras palavras se no request-body a este recurso podem vir atributos não definidos no modelo.

```txt
? Nome da classe: UserRoles
? Selecione a classe base do modelo: Entity
? Permitir propriedades adicionais (formato livre)?: Yes
```

A definir o titulo do modelo o loopback tende a preferir que o mesmo seja escrito em "camel case" (ex: UserRoles)

Posteriormente é pedido as propriedades para modelo. Cada propriedade é composta por um nome, tipo, e se é obrigatório ou não. Existe apenas uma exceção, na inserção da primeira variável é sempre perguntado se é um id. Esta pergunta é sempre repetida até que um atribiuto id seja definido.

Na eventualidade que uma propriedade "id" seja definida esta tem que seguir a seguinte seleção de opções: 

```sh
? Tipo de propriedade: string //pois um UUID é uma string
? A propriedade é id?: Yes
? O id é gerado autaticamente?: No
? É necessário?: No //Se é necessário na criação de um registo
? Valor padrão [deixar vazio para nenhum]: *Premir ENTER*
```
O id não é gerado automaticamente, pois, isto já é tudo tratado num atributo presente na propriedade. Este atributo utiliza uma função nativa da base de dados usada, neste caso postgres, responsável pela criação de um uuid único a cada registo inserido.

```ts
@property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4' ---> este aqui
})
id: string;
```

Propiedades, ou "property", podem ter os seguintes atributos:

```ts
@property({
    type: 'string', // Para ver mais tipos seguir link: https://loopback.io/doc/en/lb4/LoopBack-types.html
    id: true, //define a primaryKey
    generated: false, //usado apenas no caso de se a propiedade seja um id e seja incrimentavel
    default: 'VALOR_DEFAULT'
    defaultFn: 'NOME_FUNÇÃO', //Igual ao default, mas é uma função que define que valor retorna
    hidden: false, //(optional default é false) atributo usado caso se pretenda que propriedade seja omitida da resposta
    description: "description" //(optional) descrição da propiedade
    jsonSchema: {} //(optional) seguir link: http://json-schema.org/learn/getting-started-step-by-step.html
})
id: : string;
```

---

Visto que estamos a usar a framework em conjunto com postgres, o loopback permite que seja definido mais detalhadamente como a propriedade deve ser instanciada na base de dados, isto é feito através de um atributo denominado de `postgresql`, e seus atributos, presente na propriedade.

```ts
@property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
    postgresql: { ---> este atributo
      columnName: 'id',
      dataType: 'UUID',
      dataLength: null, 
      dataPrecision: null, 
      dataScale: null,
      nullable: 'NO'
    }
})
id: string;
```
Dentro deste atributo é possível definir o seu nome na base de dados, o seu tipo de dados, se pode ser um valor nulo, "dataLength" (caso seja um varchar quantos caracteres é possível este conter), "dataPrecision" e "dataScale".

**NOTA:** Por vezes em propriedades com tipo data/tempo, ter os atributos, dataLength, dataPrecision ou dataScale presentes no atributo postgres da propriedade pode gerar erros a migrar o modelo para a base dados.

---

Assim como a propriedade, o modelo também pode ter alguns atributos nele definido de forma a controlar melhor o seu desempenho e até mesmo como instaciá-lo na base de dados. Estes atributos podem ser definidos dentro da propriedade "model", mesmo no inicio do ficheiro, da seguinte forma: 

```ts
@model({
  settings: {
    hiddenProperties: ['password'],
    postgresql: {
      table: 'app_users',
    },
    strict: false,
    description: 'Dados dos utilizadores que acedem às aplicações.',
  }
})
export class User extends Entity {
    ...continuação do modelo
```

* O atributo `hiddenProperties` é um array de strings usado para esconder as propriedades nele definido do body das respostas da API, neste caso, sempre que é pedido informção de um ou mais utilizadores, garantimos que informação sensivel, como a passoword, não é envidada.

* O atributo `postgresql`, assim como nas propriedades do modelo, serve para definir como queremos que tabela seja instaciada na base dados, estando a ser usado o atributo `table` para definir o nome da tabela na base dados.

* O atributo `strict` é usado para definir se no request-body feito a este recurso, neste caso Users, se apenas pode vir propriedades definidas no modelo.

* O atributo `scope` é conjunto de regras que todas as querys tem que seguir obrigatoriamente, para saber mais seguir este link: https://loopback.io/doc/en/lb4/Model.html#scope

## Passo 2 - Criação do repositóro

"Repository" é o ficheiro que o loopback usa para fazer a conexeção do modelo à base de dados, servindo este para definir as relações, previamente feitas no modelo, entre a tabela de origem com outras tabelas assim como exportar a tabela através do comando `npm run migrate`. Este tipo de ficheiros podem ser encontrados no seguinte local: `loopback/src/repositories`;

Para criar um repositório basta correr o seguinte comando no "root" do projeto loopback:

```sh
lb4 repository
```

Posteriormente é perguntado o "datasource", ou ligação à base de dados, que se presente usar, seguido dos modelos que se pretende criar repositórios.

## Passo 3 - Criação do controlador

"Controllers" são o ficheiro onde os recursos (endpoints) do modelo são definidos. Este tipo de ficheiros podem ser encontrados no seguinte local: `loopback/src/controllers`;

Para criar um controlador basta correr o seguinte comando no "root" do projeto loopback:

```sh
lb4 controller
```

Após selecionar o repositório para qual pretendemos criar um repositório, irá ser perguntado se no recurso `post` queremos omitir o atributo `id`, o qual respondemos sempre que sim.

Em cada recurso do controllador é possível definir vários parâmetros de inicialização, segurança, tipo de resposta (recebida e enviada) e que tipo de atributos estamos à espera de receber, podendo estes ser acompanhados de um filtro, assim quais é que devem ser enviados na resposta.

É definido da seguinte maneira uma rota que só pode ser acedida com utilizadores autenticados:

```ts
@post('/users/one', {
  responses: {
    '200': {
      description: 'User',
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['id', 'roles'],
          }),
        },
      },
    },
  },
})
@authenticate('jwt') ----> esta função
async create(@requestBody(ExampleBodyRequest) newUserRequest : User,
): Promise<User | Response> {
```

Dentro da função é passada a regra de autenticação, ou "auth strategy", definida no seguinte caminho `loopback/src/authentication/jwt-strategy.ts`.

Pode também ser definido o método de autorização, deixando apenas usar este recurso quem está autenticado e tem pelo menos uma das seguintes permissões

```ts
@post('/users/one', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              exclude: ['id', 'roles'],
            }),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN'], ----> permissões autorizadas
    voters: [basicAuthorization], ----> método usado
  })
```

Esta função pode ser encontrada no caminho `loopback/src/middleware/auth.middleware.ts`.

### Links

https://loopback.io/doc/en/lb4/todo-tutorial-controller.html

https://loopback.io/doc/en/lb4/todo-tutorial-repository.html

https://loopback.io/doc/en/lb4/todo-tutorial-model.html