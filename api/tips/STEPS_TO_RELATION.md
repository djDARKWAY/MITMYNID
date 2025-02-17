# Nova Relation

O loopback dá a opção de criar relações entre modelos, de forma a que se possa obter registos relacionados com o modelo de origem. Relações são tratadas como se fossem propriedades, tendo que definir primeiro o nome do atributo que representa a relação e depois o nome da mesma.

**NOTA:** Querys chamam os filtros apartir do nome da relação e não do atributo, pois podemos ter uma foreignKey acompanhada de uma relação, porém, ambas são atributos diferentes.

É usado, maioritariamente, os seguintes tipos de relações:

* ### BelongsTo

  Usamos a relação belongsTo quando pretendemos obter dados do modelo de destino a que propriedade definida pertence.

  ### Tipo de relação
  1:1
  
  ### Exemplo
  ```ts
    //Relação entre presença e membro
    @belongsTo(() => Member, {name: 'member'}, {
        type: 'string',
        required: true,
        postgresql: {
            columnName: 'member_id', 
            dataType: 'uuid', 
            dataLength: null, 
            dataPrecision: null, 
            dataScale: null, 
            nullable: 'NO'
        },
    })
    memberId: string; 
  ```

  Neste exemplo temos uma presença que pertence a um membro, sendo o nome da relação entre os dois modelos "member", porém, podemos reparar em uma peculiaridade que apenas o belongsTo permite, definir uma propriedade ao mesmo tempo que definimos uma relação, podendo tratar dos dois atributos separadamente.

  A função está então dividia em 3 partes:
  
  ```ts
    @belongsTo(() => /*TIPO DO MODELO DE DESTINO*/, {name: 'NOME_RELACAO'}, {/*DEFINIÇÃO DA PROPRIEDADE (opcional mas recomendado)*/})
    nomeatributo: tipo;
  ```

  É também possível definir os atributos "keyFrom", foreignKey no modelo de origem, e "keyTo", primaryKey do modelo de destino, porém, quando não definimos é tratado autumaticametente da seguinte maneira:

  ```ts
    //Relação entre presença e membro
    @belongsTo(() => Member, {name: 'member', keyFrom: 'memberId', keyTo: 'id'}, {
        type: 'string',
        required: true,
        postgresql: {
            columnName: 'member_id', 
            dataType: 'uuid', 
            dataLength: null, 
            dataPrecision: null, 
            dataScale: null, 
            nullable: 'NO'
        },
    })
    memberId: string; 
  ```

  ---

* ### HasOne

  Usamos a relação hasOne quando pretendemos obter apenas um registo de um modelo de destino o qual tenha uma foreignKey que seja a mesma que a primaryKey (id) do modelo de origem.

  ### Tipo de relação
  1:1
  
  ### Exemplo
  ```ts
    //Relação entre reunião e assembleia
    @hasOne(() => Assembly, {keyTo: 'id', keyFrom: 'assemblyId'})
    assembly?: Assembly;
  ```

  Para que esta relação seja bem sucedida temos que adicionar um "keyFrom", variável dentro do modelo de origem (foreignKey), e um "keyTo", primaryKey no modelo de destino.

  ---

* ### HasMany

  Usamos a relação hasMany quando pretendemos vários registos de um modelo de destino o qual tenha uma foreignKey que seja a mesma que a primaryKey (id) do modelo de origem.

  ### Tipo de relação
  1:N
  
  ### Exemplo
  ```ts
    //Relação entre reunião e presenças
    @hasMany(() => Attendance)
    attendances: Attendance[];
  ```
  Esta relação já trata automaticamente do "keyFrom" e "keyTo", porém, se necessário podem ser configurados. 

  ---

* ### HasManyThrough

  Usamos a relação hasManyThrough quando pretendemos vários registos de um modelo de destino através de uma tabela intermediária.

  ### Tipo de relação
  N:N
  
  ### Exemplo
  ```ts
    //Relação Users -> UserRoles -> Roles
    @hasMany(() => Role, {through: {model: () => UserRole, keyFrom: 'app_users_id', keyTo: 'role_id'}})
    roles: Role[] | string[];
  ```

---

Para gerar uma relação com a CLI do loopback basta inserir o seguinte comando no root do projeto: 

```sh
lb4 relation
```

Depois de criada a relação os seguintes ficheiros podem ser criados/editados:

* Atualizar source Model class: /src/models/${sourceModel-Name}.model.ts
* Atualizar target Model class: /src/models/${targetModel-Name}.model.ts
* Atualizar source Model Repository class: /src/repositories/$      {sourceModel-Repository-Name}.repository.ts
* Atualizar target Model Repository: /src/repositories/$* {targetModel-Repository-Name}.repository.ts
* Criar um Controller para a nova relação da seguinte forma: /src/controllers/{sourceModel-Name}-{targetModel-Name}.controller.ts
* Atualizar /src/controllers/index.ts para exportar a classe Controller recém-criada.

---

Para incluir a relação na query à base de dados basta fazer da seguinte maneira:

```ts
    await this.userRepository.findById(id, { include:[{relation: 'roles'}] });
```

## Links

https://loopback.io/doc/en/lb4/Relations.html