import { Player } from './player';
import { ServerOptions } from './serverOptions';
export interface ClientConnectMessage {
    clientId: string;
    connectedClients: Player[];
    serverOptions: ServerOptions;
}