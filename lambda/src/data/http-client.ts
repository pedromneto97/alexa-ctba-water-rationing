export interface HttpClient {
    get(url: string, params: any): Promise<any>;
}
