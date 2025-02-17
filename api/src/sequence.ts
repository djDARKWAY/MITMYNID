//Authentication Sequence
import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) { }



  async handle(context: RequestContext) {
    try {

      const cors = {
        origin: ["http://localhost", "http://localhost:81", "http://localhost:4173", "http://localhost:4174", "https://arm.mitmynid.com", "https://arm-man.mitmynid.com"],
        default: "https://arm.mitmynid.com"
      }
      const { request, response } = context;
      const origin = cors.origin.includes(request.header('origin')?.toLowerCase() ?? '') ? request.headers.origin : cors.default;

      response.header('Access-Control-Allow-Origin', origin)
      response.header('Content-Security-Policy', `frame-ancestors 'none'; default-src 'self' localhost:13090; img-src 'self'; script-src 'self'; style-src 'self' 'sha256-TYU7EqjAMu7+rgwFl/T8//n3iwrcC7qohBYBwli/H4k='; form-action 'self'`)

      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      //call authentication action
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 /* Unauthorized */ });
      }

      this.reject(context, err);
      return;
    }
  }
}
