import { RestBindings } from '@loopback/rest';
import { ApplicationConfig, OcurrenciasLoopbackApplication } from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {

  const RestApp = new OcurrenciasLoopbackApplication(options);

  await RestApp.boot();
  await RestApp.start();
  RestApp.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({ limit: '5mb' }) // limit for images

  const RestUrl = RestApp.restServer.url;
  console.log(`Server is running at ${RestUrl}`);

  return RestApp;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: + (process.env.PORT ?? 13090),
      host: process.env.HOST ?? '127.0.0.1',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,

      },
      cors: {
        origin: ['localhost:80', 'localhost:81', 'localhost:4173', 'https://arm.mitmynid.com/', 'https://arm-man.mitmynid.com/'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: ['Origin, Content-Type, Accept, Authorization, Access-Control-Allow-Origin'],
        exposeHeaders: ['X-Total-Count', 'Link'],
        credentials: true,
      },
      expressSettings: {
        'x-powered-by': false,
      },
      apiExplorer: {
        disabled: true,
      },
    }
  };

  //TEMPORARY
  process.on('uncaughtException', (reason, promise) => {
    console.log('uncaughtException at:', reason.stack ?? reason);
  });

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
