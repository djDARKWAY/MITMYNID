import {inject} from '@loopback/core';
import {LogRepository} from '../repositories';

export class LogService {
  constructor(
    @inject('repositories.LogRepository')
    private logRepository: LogRepository,
  ) {}

  /* Lista de logs
    - Login bem sucedido
    - Login falhado
    - Logout
    - Certificado atualizado
    - Certificado eliminado
    - Entidade atualizado
    - Entidade eliminado
    - Ponto de acesso atualizado
    - Ponto de acesso eliminado
    - Utilizador adicionado
    - Utilizador editado
    - Utilizador eliminado
    - Utilizador restaurado
    - Conta desbloqueada
    - Registo de utilizador aceite
    - Registo de utilizador recusado
    - Pedido de registo recebido
  */
  
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
      type_id: 3,
      message: `Falha de login para o utilizador '${userId}'. Motivo: ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: { ip, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logLogout(userId: number | string, ip: string, deviceInfo: { device: string; os: string }, userUuid: string) {
    await this.logRepository.create({
      type_id: 5,
      message: `O utilizador '${userId}' realizou logout com sucesso`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
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

  // Métodos relacionados a Warehouse
  async logWarehouseChange(userId: string, warehouseId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' atualizou o armazém com o ID '${warehouseId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logWarehouseDelete(userId: string, warehouseId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 3,
      message: `O utilizador '${userId}' apagou o armazém com o ID '${warehouseId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // Métodos relacionados a AccessPoint
  async logAccessPointChange(userId: string, accessPointId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O utilizador '${userId}' atualizou o ponto de acesso com o ID '${accessPointId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logAccessPointDelete(userId: string, accessPointId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 3,
      message: `O utilizador '${userId}' apagou o ponto de acesso com o ID '${accessPointId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // Métodos relacionados a User
  async logUserAdd(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O administrador '${adminId}' adicionou o utilizador com o ID '${userId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logUserEdit(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O administrador '${adminId}' editou o utilizador com o ID '${userId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logUserDelete(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 3,
      message: `O administrador '${adminId}' apagou o utilizador com o ID '${userId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // Métodos para novas funcionalidades
  // 1. Logs para Reversão de Contas Eliminadas
  async logUserRestore(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    try {
      await this.logRepository.create({
        type_id: 1,
        message: `O administrador '${adminId}' restaurou a conta do utilizador com o ID '${userId}'`,
        timestamp: new Date().toISOString(),
        metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      console.error("Error creating log for user restore:", err);
    }
  }

  // 2. Logs para Desbloqueio de Contas
  async logUserUnlock(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    try {
      await this.logRepository.create({
        type_id: 1,
        message: `O administrador '${adminId}' desbloqueou a conta do utilizador com o ID '${userId}'`,
        timestamp: new Date().toISOString(),
        metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      console.error("Error creating log for user unlock:", err);
    }
  }

  // 3. Logs para Registo de Novas Contas
  async logUserRegistrationApproval(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 1,
      message: `O administrador '${adminId}' aceitou o registo do utilizador com o ID '${userId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  async logUserRegistrationRejection(adminId: string, userId: number | string, ip: string, userUuid: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 3,
      message: `O administrador '${adminId}' recusou o registo do utilizador com o ID '${userId}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, userUuid, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }

  // 4. Logs para pedido de registo de contas
  async logUserRegistrationRequest(username: string, email: string, ip: string, deviceInfo: { device: string; os: string }) {
    await this.logRepository.create({
      type_id: 2,
      message: `Novo pedido de registo para o utilizador '${username}' com email '${email}'`,
      timestamp: new Date().toISOString(),
      metadata: { ip, device: deviceInfo.device, os: deviceInfo.os, timestamp: new Date().toISOString() },
    });
  }
}