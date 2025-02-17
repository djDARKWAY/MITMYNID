//import { model, property } from "@loopback/repository";
import { SchemaObject } from "@loopback/rest";

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
      id: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      person_name: {
        type: 'string'
      },
      roles: {
        type: 'Array'
      }
  },
};

const UserSignInSchema: SchemaObject = {
  type: 'object',
  required: ['person_name', 'email', 'password', 'roles'],
  properties: {
    person_name: {
      type: 'string',
      //pattern: '/^\S[a-zA-Z ]{3,}$/',
      minLength: 3
    },
    email: {
      type: 'string',
      format: 'email',
      //pattern: '/^\S(([a-zA-Z0-9.@]+[a-zA-Z0-9]){1,})+@([a-z0-9]{2,})+\.([a-z0-9]{2,})*$/'
    },
    password: {
      type: 'string',
      minLength: 6,
      //pattern: '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/'
    },
    photo: {
      type: 'object',
    },
    roles: {
      type: 'array'
    },
  },
};

const UserPublicSignSchema: SchemaObject = {
  type: 'object',
  required: ['person_name', 'email', 'password', 'mobile', 'nif', 'entidade'],
  properties: {
    person_name: {
      type: 'string',
      //pattern: '/^\S[a-zA-Z ]{3,}$/',
      minLength: 3
    },
    email: {
      type: 'string',
      format: 'email',
      //pattern: '/^\S(([a-zA-Z0-9.@]+[a-zA-Z0-9]){1,})+@([a-z0-9]{2,})+\.([a-z0-9]{2,})*$/'
    },
    password: {
      type: 'string',
      minLength: 6,
      //pattern: '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/'
    },
    nif: {
      type: 'string',
      maxLength: 9,
      minLength: 9
    },
    username: {
      type: 'string'
    }
  },
};

const CredentialsLoginSchema: SchemaObject = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      //pattern: '^\S[a-zA-Z0-9_]{3,}$'
    },
    password: {
      type: 'string',
      minLength: 6,
      //pattern: '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/'
    },
    id: {
      type: 'string',
      minLength: 3,
      //pattern: '^\S[a-zA-Z0-9_]{3,}$'
    },
    code: {
      type: 'string',
      minLength: 6,
      //pattern: '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/'
    },
  },
};


export const CredentialsSignInRequestBody = {
  description: 'The input for the sign in function',
  required: true,
  content: {
      'application/json': {schema: UserSignInSchema},
  },
};

export const CredentialsPublicSignRequestBody = {
  description: 'The input for the sign in function',
  required: true,
  content: {
      'application/json': {schema: UserPublicSignSchema},
  },
};

export const CredentialsLoginRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
      'application/json': {schema: CredentialsLoginSchema},
  },
};

// export function validateNIF(nif: string) {

//   const validationSets = {
//     one: ['1', '2', '3', '5', '6', '8'],
//     two: ['45', '70', '71', '72', '74', '75', '77', '79', '90', '91', '98', '99']
//   };

//   if (nif.length !== 9) return false;
//   if (!validationSets.one.includes(nif.substr(0, 1)) && !validationSets.two.includes(nif.substr(0, 2))) return false;
//   const nifNumbers = nif.split('').map(c => Number.parseInt(c))
//   const total = nifNumbers[0] * 9 +
//     nifNumbers[1] * 8 +
//     nifNumbers[2] * 7 +
//     nifNumbers[3] * 6 +
//     nifNumbers[4] * 5 +
//     nifNumbers[5] * 4 +
//     nifNumbers[6] * 3 +
//     nifNumbers[7] * 2;
//   const modulo11 = (Number(total) % 11);
//   const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;
//   return checkDigit === Number(nif[8]);

// }
