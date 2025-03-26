import {inject} from '@loopback/core';
import {LogRepository} from '../repositories';

export class LogService {
  constructor(
    @inject('repositories.LogRepository')
    private logRepository: LogRepository,
  ) {}

  // Métodos relacionados a Login
  async logLoginSuccess(userId: number | string, ip: string, deviceInfo: { device: string; os: string }, userUuid: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `O utilizador '${userId}' realizou login com sucesso`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logLoginFailure(userId: string, ip: string, reason: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 5,
      message: `Falha de login para o utilizador '${userId}'. Motivo: ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: { ip, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // Métodos relacionados a Certificate
  async logCertificateChange(userId: string, certificateId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' atualizou o certificado com o ID '${certificateId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logCertificateDelete(userId: string, certificateId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' apagou o certificado com o ID '${certificateId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // Métodos relacionados a Company
  async logCompanyChange(userId: string, companyId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' atualizou o armazém com o ID '${companyId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logCompanyDelete(userId: string, companyId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' apagou o armazém com o ID '${companyId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }
}