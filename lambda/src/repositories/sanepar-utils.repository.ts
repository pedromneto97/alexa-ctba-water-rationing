import { inject, injectable } from "inversify";
import { SaneparUtilsHttpClient } from "../data";
import { Candidate, AddressModel } from "../models";

@injectable()
export class SaneparUtilsRepository {
    static type = Symbol.for('SaneparUtilsRepository');
    @inject(SaneparUtilsHttpClient.type) private saneparUtilsHttpClient: SaneparUtilsHttpClient;

    public async getCandidates(address: AddressModel): Promise<Candidate> {
        const data = await this.saneparUtilsHttpClient.get(
            '/rest/services/World/GeocodeServer/findAddressCandidates',
            {
                'SingleLine': this.mapAddressToSingleLine(address),
                'f': 'json',
                'countryCode': 'BRA',
            });
        if (data.candidates.length === 0) {
            throw new Error('Não foi encontrado um endereço válido');
        }

        return {
            x: data.candidates[0].location.x,
            y: data.candidates[0].location.y,
            wkid: data.spatialReference.wkid,
        }
    }

    private mapAddressToSingleLine(address: AddressModel) {
        return `${address.street}, ${address.city} - ${address.state}`;
    }
}
