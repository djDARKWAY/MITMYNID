import {BindingKey} from '@loopback/context';
import {TokenService, UserService} from '@loopback/authentication';
import {User} from './models';
import {Credentials} from './repositories';
import {CustomUserService, PasswordHasher, TesteManager} from './services';
import { EmailManager } from './services/email.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'i4*KJu#3!!LHJRp*%bLRw4X23gAoBJ4%XQX6R^e5#H%aWry5d&E*@8S#*@g7@*Zm';
  export const TOKEN_EXPIRES_IN_VALUE = '43200';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace AuthServiceBindings {
  export const AUTH_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.auth.service',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<CustomUserService>(
    'services.user.service',
  );
}

export namespace TesteServiceBindings {
  export const TESTE_SERVICE = BindingKey.create<TesteManager>(
    'services.teste.service',
  );
}

//Mailer
export namespace EmailServiceBindings {
  export const EMAIL_SERVICE = BindingKey.create<EmailManager>(
    'services.email.service'
  )
}
