import {Interceptor} from '@loopback/context';
import {RestBindings} from '@loopback/rest';
import { decode } from 'jsonwebtoken';

export const log: Interceptor = async (invocationCtx, next) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userRepository = invocationCtx.target.userRepository;
  const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {optional: true,});

  if (httpReq) {
    //console.log(httpReq)
    const decodedToken = decode(<string>httpReq.header("Authorization")?.split(' ')[1])
    //console.log(decodedToken)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await userRepository.updateById(decodedToken.id, {'last_access': new Date()})
  }
  // Wait until the interceptor/method chain returns
  const result = await next();
  return result;
};
