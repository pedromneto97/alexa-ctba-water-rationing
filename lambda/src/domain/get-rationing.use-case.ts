import { HandlerInput } from "ask-sdk-core";
import format from "date-fns/format";
import { inject, injectable } from "inversify";
import { SaneparRepository, SaneparUtilsRepository } from "../repositories";
import { AddressService, PermissionService } from "../services";

@injectable()
export class GetRationingUseCase {
    static type = Symbol.for('GetRationingUseCase');

    @inject(SaneparRepository.type) private saneparRepository: SaneparRepository;
    @inject(SaneparUtilsRepository.type) private saneparUtilsRepository: SaneparUtilsRepository;
    @inject(PermissionService.type) private permissionService: PermissionService;
    @inject(AddressService.type) private addressService: AddressService;

    public async execute(handler: HandlerInput) {
        const { responseBuilder } = handler;
        try {
            const hasPermission = this.permissionService.hasPermission(handler);
            if (!hasPermission) {
                return responseBuilder
                    .speak('Por favor, habilite a permissão de localização no aplicativo Amazon Alexa')
                    .withAskForPermissionsConsentCard(['read::alexa:device:all:address'])
                    .getResponse();
            }


            const address = await this.addressService.getUserAddress(handler);

            const candidates = await this.saneparUtilsRepository.getCandidates(address);

            const codope = await this.saneparRepository.getCodope(candidates);

            const { isRationing, nextDate } = await this.saneparRepository.getRationing(codope);

            if (isRationing) {
                return responseBuilder
                    .speak(`Atualmente está havendo um rodízio que se encerra ${format(nextDate, "d/M/yyyy 'às' H")} horas`)
                    .getResponse();
            }

            return responseBuilder
                .speak(`Atualmente não está havendo um rodízio. O próximo inicia ${format(nextDate, "d/M/yyyy 'às' H")} horas`)
                .getResponse();
        } catch (e) {
            return responseBuilder
                .speak(e.message)
                .getResponse();
        }
    };
}
