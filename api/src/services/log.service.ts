import {inject} from '@loopback/core';
import {LogRepository} from '../repositories';
import {Log} from '../models';

export class LogService {
  constructor(
    @inject('repositories.LogRepository')
    private logRepository: LogRepository,
  ) {}

  async logLoginSuccess(userId: number | string, ip: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `Utilizador "${userId}" efetuou login com sucesso.`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }

  async logLoginFailure(username: string, ip: string, reason: string) {
    await this.logRepository.create({
      type_id: 6,
      message: `Tentativa de login falhada para o utilizador "${username}": ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }
}
