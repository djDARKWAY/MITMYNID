import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PedidosRemocao, PedidosRemocaoRelations} from '../models';

export class PedidosRemocaoRepository extends DefaultCrudRepository<
  PedidosRemocao,
  typeof PedidosRemocao.prototype.id,
  PedidosRemocaoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PedidosRemocao, dataSource);
  }
}
