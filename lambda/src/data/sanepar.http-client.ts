import axios, { AxiosInstance } from 'axios'
import { injectable } from 'inversify';
import { HttpClient } from './http-client';

@injectable()
export class SaneparHttpClient implements HttpClient {
    static type = Symbol.for("SaneparHttpClient");

    private client: AxiosInstance
    constructor() {
        this.client = axios.create({
            baseURL: 'https://services1.arcgis.com/46Oage49MS2a3O6A/arcgis/rest/services/Mapa_Rodizio_Abastecimento_RMC_View/FeatureServer',
        });
    }

    public get<T = any>(url: string, params: any) {
        return this.client.get<T>(url, {
            params
        }).then(response => response.data);
    }
}
