# Novo Service

"Services", ou serviço, são o tipos de ficheiros que podem ser usados de forma a criar a lógica necessária para os controladores. Estes têm maior importância quando algum método é aplicado repetidamente a vários recursos, ou "endpoins", ajudando a diminuir as potênciais falhas que possam vir a existir devido a copiar o mesmo método em vários recursos. Este tipo de ficheiro pode ser encontrado seguindo o caminho: `loopback/src/services`.

Para criar um serviço basta executar o seguinte comando:

```txt
lb4 service
```

Este comando irá pedir um nome para o serviço, assim como o tipo de serviço, sendo o tipo selecionado o seguinte: 

```txt
? Tipo service: Provedor de serviços local vinculado ao contexto de aplicativo
```

Depois de este comando ser executado com sucesso precisamos de "injetar" o serviço na aplicação de forma a que possa ser usado em qualquer classe da aplicação.

Primeiro precisamos de criar uma interface para o serviço:

```ts
import {injectable, BindingScope} from '@loopback/core';
import { User } from '../models';

export interface TesteManager { ------------> interface
  printUserDetails(userDetails: User): string;
}

@injectable({scope: BindingScope.TRANSIENT})
export class TesteService {
  constructor(
    /* Add @inject to inject parameters */
  ) {}

  printUserDetails(userDetails: User) : string {
    
    console.log("This is the user");
    console.log(userDetails.person_name);

  }

}
```

**NOTA** - O ficheiro gerado pelo comando `lb4 service` é signitivamente diferente do apresentado, porém desta forma o serviço é de mais fácil compreensão.

De seguida iremos criar uma "BindingKey", para que este serviço possa ser invocado em qualquer classe da aplicação. Esta "BindingKey" é por norma colocada num ficheiro `keys.ts` no root da pasta `src`. Caso o ficheiro não exista este terá que ser criado no local mencionado.

```ts
export namespace TesteServiceBindings {
  export const TESTE_SERVICE = BindingKey.create<TesteManager>(
    'services.teste.service', //services.NOMEABREVIADO.service
  );
}
```

A função `create` requer que importemos a interface previamente criada e consome um único parâmetro, o nome da "BindingKey", que deve ser único.

De seguida temos que dar "Bind" à "BindingKey", que acabamos de criar, com o serviço, isto é feito no ficheiro `application.ts`, localizado no root da pasta `src`.

```ts
export class OcurrenciasLoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    this.static('/files/*', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    this.add(createBindingFromClass(JWTAuthenticationStrategy));
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.setUpBindings();
    //this.bind('socket').to(socket);

    //função para criação de pastas de fotos
    this.setUpFolders();
  }
 
  private setUpBindings(): void { //função para dar setup às Binds

    // Bind package.json to the application context
    // this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
        TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
        TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind(TesteServiceBindings.TESTE_SERVICE).toClass(TesteService); ---> novo Bind
  }
}
```

Desta forma todos os "Binds" necessários são inicializados assim que a aplicação arranca.

Por fim este serviço pode ser invocado nas classes da seguinte maneira:

```ts
export class AuthController {
    constructor(
      @repository(UserRepository) public userRepository : UserRepository,
      @repository(UserRoleRepository) public userRoleRepository: UserRoleRepository,
      @repository(RoleRepository) public roleRepository: RoleRepository,
      @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
      @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
      @inject(UserServiceBindings.USER_SERVICE) public userService: UserService<User, Credentials>,
      @inject(RestBindings.Http.RESPONSE) private response: Response,
      @inject(SecurityBindings.USER, { optional: true }) public user: UserProfile,
      @inject(TesteServiceBindings.TESTE_SERVICE) public testeService: TesteService, //----> novo serviço
    ) {}
    ...continuação da classe
```

### Links

https://loopback.io/doc/en/lb4/Dependency-injection.html

https://loopback.io/doc/en/lb4/Service-generator.html

https://loopback.io/doc/en/lb4/Binding.html

