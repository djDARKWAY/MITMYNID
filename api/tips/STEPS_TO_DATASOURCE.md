# Nova Datasource

## IMPORTANTE - Antes de seguir estes passos verificar se existe a base de dados prentendida para armazenar os dados assim como o schema onde as tabelas iram ser colocadas.

=======================================================================

"Datasources" são o tipo de ficheiro que o loopback usa connectar com as base de dados ou outros tipos de armazenamento, como "in-memory". Este tipo de ficheiros, depois de criados, estaram localizados no caminho `loopback/src/datasources`.

Para criar um datasource basta executar o seguinte comando.

```txt
lb4 datasource
```

Este comando irá pedir um nome para a base de dados, o tipo de conexão (neste caso postgresql), e com base no tipo de conexão as variáveis necessárias para executar a mesma, tais como o host, porta, user, password e database.

A url de conexão não é necessária , porém, em algumas importações do projeto, o mesmo deixa de fazer a ligação com a base de dados mesmo tendo as restantes variáveis necessárias, então por este motivo foi decidido incluir também esta url.

Para uma url de conexão com postgresql basta a estruturar da seguinte forma:

```postgres
postgres://user:password@url:port/database
```

É então necessário um "user" e "password" que tenham acesso à base dados, a url para a mesma, se localmente apenas colocar "localhost", a porta, que geralmente é 5432, e o nome da base de dados pretendida.

É também adicionado o atributo "schema" no datasource. Este é um atributo especial ao postgresql pois serve para uma melhor organização das tabelas dentro da base de dados, caso contrário todas as tabelas exportadas iriam ser colocadas no schema "public", podendo causar conflitos.

### Links

https://loopback.io/doc/en/lb4/todo-tutorial-datasource.html

https://www.postgresql.org/docs/current/ddl-schemas.html