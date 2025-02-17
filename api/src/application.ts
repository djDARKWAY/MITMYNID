import {BootMixin} from '@loopback/boot';
import { ApplicationConfig, createBindingFromClass } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { AuthServiceBindings, EmailServiceBindings, PasswordHasherBindings, TesteServiceBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings } from "./keys";
import { BcryptHasher, CustomClassUserService, JWTService, TesteService } from "./services";
import { AuthenticationComponent, registerAuthenticationStrategy } from "@loopback/authentication";
import { AuthorizationComponent } from "@loopback/authorization";
import { JWTAuthenticationStrategy } from "./authentication/strategies/jwt-strategy";
import * as fs from 'fs';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
//import { SECURITY_SCHEME_SPEC, SECURITY_SPEC } from "./authentication/utils/security-spec";

export {ApplicationConfig};

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
    // this.configure(RestExplorerBindings.COMPONENT).to({
    //   path: '/explorer',
    // });
    // this.component(RestExplorerComponent);

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

    this.bind(AuthServiceBindings.AUTH_SERVICE).toClass(AuthService);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(CustomClassUserService);

    this.bind(TesteServiceBindings.TESTE_SERVICE).toClass(TesteService);

    this.bind(EmailServiceBindings.EMAIL_SERVICE).toClass(EmailService);
  }


  private setUpFolders(): void{
    if(!fs.existsSync('./public/files')){
        fs.mkdirSync('./public/files');
        fs.mkdirSync('./public/files/users');
    }

  }

}
