import { inject } from "@loopback/core";
import { DefaultCrudRepository } from "@loopback/repository";
import { NetworkDataSource } from "../datasources";
import { AccessPoint, AccessPointRelations } from "../models";

export class AccessPointRepository extends DefaultCrudRepository<
  AccessPoint,
  typeof AccessPoint.prototype.idAccessPoint,
  AccessPointRelations
> {
  constructor(@inject("datasources.network") dataSource: NetworkDataSource) {
    super(AccessPoint, dataSource);
  }
}
