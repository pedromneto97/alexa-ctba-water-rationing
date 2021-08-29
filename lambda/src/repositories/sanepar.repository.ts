import { inject, injectable } from "inversify";
import { Candidate, RationingModel } from "../models";
import { SaneparHttpClient } from "../data";
import isBefore from "date-fns/isBefore";

@injectable()
export class SaneparRepository {
    static type = Symbol.for('SaneparRepository');

    @inject(SaneparHttpClient.type) private saneparHttpClient: SaneparHttpClient;

    public async getCodope(candidate: Candidate): Promise<string> {
        const data = await this.saneparHttpClient.get('/1/query', {
            geometry: {
                x: candidate.x,
                y: candidate.y,
                spatialReference: {
                    wkid: candidate.wkid,
                }
            },
            f: 'json',
            geometryType: 'esriGeometryPoint',
            spatialRel: 'esriSpatialRelIntersects',
            outFields: '*',
        });

        if (data.features.length === 0) {
            throw Error('Não foi posssível encontrar o endereço');
        }

        return data.features[0].attributes.codope;
    }

    public async getRationing(codope: string): Promise<RationingModel> {
        const { features } = await this.saneparHttpClient.get<RationingResponse>('/2/query', {
            where: `CODOPE='${codope}'`,
            f: 'json',
            returnGeometry: false,
            spatialRel: 'esriSpatialRelIntersects',
            outFields: 'NORMALIZACAO,OBSERVACAO,INICIO',
        });

        features.slice(Math.max(features.length - 15, 0))

        const today = new Date();
        let lastNormalization, isRationing = false, start, normalization;

        for (let index = 0; index < features.length; index++) {
            const {
                attributes: {
                    INICIO, NORMALIZACAO
                }
            } = features[index];

            start = new Date(INICIO);
            normalization = new Date(NORMALIZACAO);

            if (lastNormalization !== undefined && isBefore(lastNormalization, today) && isBefore(today, start)) {
                console.log('Próximo rodízio vai começar em', start.toLocaleString());
                break;
            }
            if (isBefore(start, today) && isBefore(today, normalization)) {
                isRationing = true;
                console.log('Em rodízio');
                console.log('Inicio', start.toLocaleString());
                console.log('Fim', normalization.toLocaleString());
                break;
            }
            lastNormalization = normalization;
        }

        return {
            isRationing,
            nextDate: isRationing ? normalization : start,
        };
    }
}

interface RationingResponse {
    features: [
        {
            attributes: {
                NORMALIZACAO: number;
                OBSERVACAO: string | null;
                INICIO: number;
            }
        }
    ]
}
