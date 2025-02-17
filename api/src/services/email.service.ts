import nodemailer from 'nodemailer';
import config from '../utils/config.json';
import generateRegisterEmail from './emails/registerEmail';
// import generateRegisterActiveEmail from '../emails/registerActiveEmail';
import { repository } from '@loopback/repository';
import generateDeleteEmail from './emails/deleteEmail';
import generateForgotPassEmail from './emails/forgotPassEmail';
import generateAuthenticatorEmail from './emails/generateAuthenticatorEmail';
import generateRegisterActiveEmail from './emails/registerActiveEmail';
//import path from 'path';

export interface EmailManager<T = void> {
  sendMailRegister(userLocale: string, toPerson: string, key: string, person_name: string, code: string): Promise<T>;
  sendMailDelete(userLocale: string, toPerson: string, person_name: string, code: string): Promise<T>
  sendMailRegisterActive(userLocale: string, toPerson: string, person_name: string): Promise<T>;
  sendMailForgotPassword(userLocale: string, toPerson: string, person_name: string, code: string): Promise<T>;
  sendMailAuthenticator(userLocale: string, toPerson: string, person_name: string, code: string): Promise<T>;
}

const email = {
  "service": config.email_server.service,
  "auth": {
    "user": config.email_server.username,
    "pass": config.email_server.pass
  }
}

/*
 const logo = "data:image/png;base64,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na9JaeuD8A3+egAcw3f59W3aPnoHYNcNeO+N0/dswCl+6+C6Vgiz9UBhXnVNPJ113qn7YTm0EfnfupxM35v6AuupY39j++sBwK+0Od+GeAxSaKL4f4IAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACiYAICCCQAomACAggkAKJgAgIIJACjY/xMAUK7GIhQA8Pf9558G/2maQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAX/8fRMkmfzE0CgsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDEtMThUMDk6MzM6NTYrMDA6MDDih1lvAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTAxLTE4VDA5OjMzOjU2KzAwOjAwk9rh0wAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII=";
*/

export class EmailService {
  constructor(
    // @repository(TranslationsRepository) public translationRepository:TranslationsRepository
  ) { }

  async sendMailRegister(userLocale: string, toPerson: string, person_name: string, code: string): Promise<void> {

    let url
    let subject
    let farewell
    let noreply

    url = process.env.WEBSITE_URL ?? 'http://localhost'
    subject = '[Template] Registo'
    farewell = 'Atenciosamente / Hasta pronto / Yours sincerely / Cordialement,'
    noreply =
      'Mensagem automática, não responder / Mensaje automático, no responder / Automatic message, do not reply / Message automatique, ne répondez pas.';


    //const imagePath = path.join(__dirname, '/public/files/global/paredes_default_img.png');

    const address = "R. de Salazares 842, 4149-002 Porto";
    const phone = "22 532 2072 (Chamada para rede fixa nacional)";

    const mailOptions = {
      from: config.email_server.from,
      to: toPerson,
      subject: subject,
      html: generateRegisterEmail(url, farewell, noreply, address, phone, person_name, code),
      attachments: [
        {   // data uri as an attachment
          cid: config.email_server.logo.cid,
          path: config.email_server.logo.path
        },
      ]
    };

    try {

      const transporter = nodemailer.createTransport(email);

      await transporter.sendMail(mailOptions);

    } catch (err) {

      console.log(err);

    }
  }

  async sendMailRegisterActive(userLocale: string, toPerson: string, person_name: string): Promise<void> {

    let url
    let subject
    let farewell
    let noreply

    url = process.env.WEBSITE_URL ?? 'http://localhost'
    subject = '[Template] Conta ativada'
    farewell = 'Atenciosamente / Hasta pronto / Yours sincerely / Cordialement,'
    noreply =
      'Mensagem automática, não responder / Mensaje automático, no responder / Automatic message, do not reply / Message automatique, ne répondez pas.';


    //const imagePath = path.join(__dirname, '/public/files/global/paredes_default_img.png');

    const address = "R. de Salazares 842, 4149-002 Porto";
    const phone = "22 532 2072 (Chamada para rede fixa nacional)";

    const mailOptions = {
      from: config.email_server.from,
      to: toPerson,
      subject: subject,
      html: generateRegisterActiveEmail(url, farewell, noreply, address, phone, person_name),
      attachments: [
        {   // data uri as an attachment
          cid: config.email_server.logo.cid,
          path: config.email_server.logo.path
        },
      ]
    };

    try {

      const transporter = nodemailer.createTransport(email);

      await transporter.sendMail(mailOptions);

    } catch (err) {

      console.log(err);

    }
  }

  async sendMailForgotPassword(userLocale: string, toPerson: string, person_name: string, code: string): Promise<void> {

    let url
    let subject
    let farewell
    let noreply

    url = process.env.WEBSITE_URL ?? 'http://localhost'
    subject = '[Template] Recuperar Password'
    farewell = 'Atenciosamente / Hasta pronto / Yours sincerely / Cordialement,'
    noreply =
      'Mensagem automática, não responder / Mensaje automático, no responder / Automatic message, do not reply / Message automatique, ne répondez pas.';


    //const imagePath = path.join(__dirname, '/public/files/global/paredes_default_img.png');

    const address = "R. de Salazares 842, 4149-002 Porto";
    const phone = "22 532 2072 (Chamada para rede fixa nacional)";

    const mailOptions = {
      from: config.email_server.from,
      to: toPerson,
      subject: subject,
      html: generateForgotPassEmail(url, farewell, noreply, address, phone, person_name, code),
      attachments: [
        {   // data uri as an attachment
          cid: config.email_server.logo.cid,
          path: config.email_server.logo.path
        },
      ]
    };

    try {

      const transporter = nodemailer.createTransport(email);

      await transporter.sendMail(mailOptions);

    } catch (err) {

      console.log(err);

    }
  }

  async sendMailAuthenticator(userLocale: string, toPerson: string, person_name: string, code: string): Promise<void> {

    let url
    let subject
    let farewell
    let noreply

    url = process.env.WEBSITE_URL ?? 'http://localhost'
    subject = '[Template] Autenticação'
    farewell = 'Atenciosamente / Hasta pronto / Yours sincerely / Cordialement,'
    noreply =
      'Mensagem automática, não responder / Mensaje automático, no responder / Automatic message, do not reply / Message automatique, ne répondez pas.';


    //const imagePath = path.join(__dirname, '/public/files/global/paredes_default_img.png');
    console.log('AUTH EMAIL 1')
    const address = "R. de Salazares 842, 4149-002 Porto";
    const phone = "22 532 2072 (Chamada para rede fixa nacional)";

    const mailOptions = {
      from: config.email_server.from,
      to: toPerson,
      subject: subject,
      html: generateAuthenticatorEmail(url, farewell, noreply, address, phone, person_name, code),
      attachments: [
        {   // data uri as an attachment
          cid: config.email_server.logo.cid,
          path: config.email_server.logo.path
        },
      ]
    };

    try {

      const transporter = nodemailer.createTransport(email);
      console.log('AUTH EMAIL 2')

      await transporter.sendMail(mailOptions);
      console.log('AUTH EMAIL 3')

    } catch (err) {

      console.log(err);

    }
  }

  async sendMailDelete(userLocale: string, toPerson: string, person_name: string, code: string): Promise<void> {

    let url
    let subject
    let farewell
    let noreply

    url = process.env.WEBSITE_URL ?? 'http://localhost'
    subject = '[Template] Pedido de Remoção do Utilizador'
    farewell = 'Atenciosamente / Hasta pronto / Yours sincerely / Cordialement,'
    noreply =
      'Mensagem automática, não responder / Mensaje automático, no responder / Automatic message, do not reply / Message automatique, ne répondez pas.';


    //const imagePath = path.join(__dirname, '/public/files/global/paredes_default_img.png');

    const address = "R. de Salazares 842, 4149-002 Porto";
    const phone = "22 532 2072 (Chamada para rede fixa nacional)";

    const mailOptions = {
      from: config.email_server.from,
      to: toPerson,
      subject: subject,
      html: generateDeleteEmail(url, farewell, noreply, address, phone, person_name, code),
      attachments: [
        {   // data uri as an attachment
          cid: config.email_server.logo.cid,
          path: config.email_server.logo.path
        },
      ]
    };

    try {

      const transporter = nodemailer.createTransport(email);

      await transporter.sendMail(mailOptions);

    } catch (err) {

      console.log(err);

    }
  }

}
