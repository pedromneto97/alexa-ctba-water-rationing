import { HandlerInput } from 'ask-sdk-core'
import { injectable } from 'inversify';
import { AddressModel } from '../models'

@injectable()
export class AddressService {
    static type = Symbol.for('AddressService');

    public async getUserAddress({
        requestEnvelope: {
            context: {
                System: {
                    device
                }
            }
        },
        serviceClientFactory,
    }: HandlerInput): Promise<AddressModel> {
        if (!device) {
            throw Error('Ops, algo deu errado');
        }

        const deviceAddressClient = serviceClientFactory.getDeviceAddressServiceClient();
        const { addressLine1, stateOrRegion, city } = await deviceAddressClient.getFullAddress(device.deviceId);
        if (!(addressLine1 && stateOrRegion)) {
            throw Error('Parece que você não tem nenhum endereço cadastrado em sua conta Amazon Alexa');
        }

        return {
            street: addressLine1,
            city,
            state: stateOrRegion
        };
    }
}
