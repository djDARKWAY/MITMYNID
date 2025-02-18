import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'network',
  connector: 'postgresql',
  // url: 'postgres://postgres:postgres@localhost:5432/postgres',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  schema: 'network'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NetworkDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'network';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.network', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
