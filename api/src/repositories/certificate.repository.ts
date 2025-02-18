import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NetworkDataSource} from '../datasources';
import {Certificate, CertificateRelations} from '../models';

export class CertificateRepository extends DefaultCrudRepository<
  Certificate,
  typeof Certificate.prototype.idCertificate,
  CertificateRelations
> {
  constructor(
    @inject('datasources.network') dataSource: NetworkDataSource,
  ) {
    super(Certificate, dataSource);
  }
}
