import { ServerOptions } from './ServerOptions';
import { Client } from './client';
import * as WS from 'ws';
export class Server {
    private connectedClients: Client[];
    private server: WS.Server;

    public onMessage: (message: object) => void;
    public onClientConnect: (client: Client) => void;
    public onValidateConnection: (connection: any) => boolean;
    public constructor(opts: ServerOptions) {

    }

    public broadcast(data: any, sender ?: Client) {
        for (let i = 0; i < this.connectedClients.length; i++) {
            if(this.connectedClients[i].clientId==sender.clientId) continue;
            this.connectedClients[i].Send(data);
        }
    }
}