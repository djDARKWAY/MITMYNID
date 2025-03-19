import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";

const config = {
    name: "status",
    connector: "postgresql",
    // url: 'postgres://postgres:postgres@localhost:5432/postgres',
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
    schema: "status",
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver("datasource")
export class StatusDataSource
    extends juggler.DataSource
    implements LifeCycleObserver
{
    static dataSourceName = "status";
    static readonly defaultConfig = config;

    constructor(
        @inject("datasources.config.status", { optional: true })
        dsConfig: object = config
    ) {
        super(dsConfig);
    }
}
