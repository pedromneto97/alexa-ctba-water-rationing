import { Container } from "inversify";
import { SaneparUtilsHttpClient, SaneparHttpClient, HttpClient } from './data';
import { SaneparRepository } from "./repositories/sanepar.repository";
import { SaneparUtilsRepository } from "./repositories/sanepar-utils.repository";
import { AddressService } from "./services/address.service";
import { PermissionService } from "./services/permission.service";
import { GetRationingUseCase } from "./domain/get-rationing.use-case";

export const container = new Container()

container.bind<HttpClient>(SaneparUtilsHttpClient.type).to(SaneparUtilsHttpClient);
container.bind<HttpClient>(SaneparHttpClient.type).to(SaneparHttpClient);

container.bind<AddressService>(AddressService.type).to(AddressService);
container.bind<PermissionService>(PermissionService.type).to(PermissionService);

container.bind<SaneparRepository>(SaneparRepository.type).to(SaneparRepository);
container.bind<SaneparUtilsRepository>(SaneparUtilsRepository.type).to(SaneparUtilsRepository);

container.bind<GetRationingUseCase>(GetRationingUseCase.type).to(GetRationingUseCase);
