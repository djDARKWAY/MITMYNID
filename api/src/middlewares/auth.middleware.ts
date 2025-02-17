import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'person_name',
      'roles'
    ]);
    currentUser = {[securityId]: user.id, person_name: user.person_name, roles: user.roles};
    //console.log(currentUser)
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  if (metadata.allowedRoles!.some(r=> currentUser.roles.indexOf(r) >= 0)) {
    roleIsAllowed = true;
  }

  if (!roleIsAllowed) {
    //console.log('!roleIsAllowed')
    return AuthorizationDecision.DENY;
  }

  return AuthorizationDecision.ALLOW;
}
