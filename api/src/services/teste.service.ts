import {injectable, BindingScope} from '@loopback/core';
import { User } from '../models';

export interface TesteManager {
  printUserDetails(userDetails: User): void;
}

@injectable({scope: BindingScope.TRANSIENT})
export class TesteService {
  constructor(
    /* Add @inject to inject parameters */
  ) {}

  printUserDetails(userDetails: User) : void {
    console.log("This is the user");
    console.log(userDetails.person_name);
  }

}
