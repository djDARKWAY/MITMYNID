import { inject } from "@loopback/core";
import { DefaultCrudRepository, BelongsToAccessor, repository } from "@loopback/repository";
import { NetworkDataSource } from "../datasources";
import { AccessPoint, AccessPointRelations } from "../models";
import { Warehouse } from "../models/warehouse.model";
import { WarehouseRepository } from "./warehouse.repository";
import { Getter } from "@loopback/core";

export class AccessPointRepository extends DefaultCrudRepository<
  AccessPoint,
  typeof AccessPoint.prototype.id,
  AccessPointRelations
> {
  public readonly warehouse: BelongsToAccessor<Warehouse, typeof AccessPoint.prototype.id>;

  constructor(
    @inject("datasources.network") dataSource: NetworkDataSource,
    @repository.getter("WarehouseRepository") protected warehouseRepositoryGetter: Getter<WarehouseRepository>
  ) {
    super(AccessPoint, dataSource);

    this.warehouse = this.createBelongsToAccessorFor("warehouse", warehouseRepositoryGetter);
    this.registerInclusionResolver("warehouse", this.warehouse.inclusionResolver);
  }
}
