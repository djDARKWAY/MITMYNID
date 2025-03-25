import {inject} from '@loopback/core';
import {LogRepository} from '../repositories';

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

  async logLoginFailure(userId: string, ip: string, reason: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `Tentativa de login falhada para o utilizador "${userId}": ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }

  async logCertificateChange(userId: string, certificateId: number | string, ip: string) {
    await this.logRepository.create({
      type_id: 1,
      message: `Utilizador "${userId}" alterou o certificado com ID "${certificateId}".`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }
}
