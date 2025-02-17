import {Credentials} from '../repositories';
import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';

export function validateCredentials(credentials: Credentials) {

  //@ts-ignore
  if (!credentials.person_name || credentials.person_name.length < 2) {
    throw new HttpErrors.UnprocessableEntity(
      'Name must be at least 4 charactes',
    );
  }

  // Validate Email
  //@ts-ignore
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 6) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 6 characters',
    );
  }
}
