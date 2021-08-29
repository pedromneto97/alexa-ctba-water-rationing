import { HandlerInput } from 'ask-sdk-core'
import { injectable } from 'inversify';

@injectable()
export class PermissionService {
    static type = Symbol.for('PermissionService');

    hasPermission({ requestEnvelope: { context: { System: { user: { permissions } } } } }: HandlerInput) {
        return !!(permissions && permissions.consentToken);
    }
}
