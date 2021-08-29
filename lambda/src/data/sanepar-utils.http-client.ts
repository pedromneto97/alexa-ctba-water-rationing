import axios, { AxiosInstance } from 'axios'
import { injectable } from 'inversify';
import { HttpClient } from './http-client';

@injectable()
export class SaneparUtilsHttpClient implements HttpClient {
    static type = Symbol.for("SaneparUtilsHttpClient");

    private client: AxiosInstance
    constructor() {
        this.client = axios.create({
            baseURL: 'https://utility.arcgis.com/usrsvcs/servers/b89ba3a68c664268b9bdea76948b4f11',
        });
    }

    public get(url: string, params: any) {
        return this.client.get(url, {
            params
        }).then(response => response.data);
    }
}
