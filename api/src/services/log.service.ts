import {inject} from '@loopback/core';
import {LogRepository} from '../repositories';

export class LogService {
  constructor(
    @inject('repositories.LogRepository')
    private logRepository: LogRepository,
  ) {}

  // Métodos relacionados a Login
  async logLoginSuccess(userId: number | string, ip: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `O utilizador '${userId}' realizou login com sucesso.`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }

  async logLoginFailure(userId: string, ip: string, reason: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `Falha de login para o utilizador '${userId}'. Motivo: ${reason}.`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }

  // Métodos relacionados a Certificate
  async logCertificateChange(userId: string, certificateId: number | string, ip: string) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' atualizou o certificado com o ID '${certificateId}'.`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }

  async logCertificateDelete(userId: string, certificateId: number | string, ip: string) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' apagou o certificado com o ID '${certificateId}'.`,
      timestamp: new Date().toISOString(),
      metadata: { ip },
    });
  }
}
