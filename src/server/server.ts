import { ServerOptions } from './ServerOptions';
import { Client } from './client';
import { EpochMessageHandler } from './epochMessageHandler';
import { ImmediateMessageHandler } from './immediateMessageHandler';
import * as WS from 'ws';
import { ClientID } from './clientId';
import { MessageHandler } from './messageHandler';
export class Server {
    private connectedClients: Client[];
    private server: WS.Server;
    private port:number;
    private messageHandler: MessageHandler;

    public onMessage: (message: object) => void;
    public onClientConnect: (client: Client) => void;
    public onValidateConnection: (connection: any) => boolean;

    public constructor(opts: ServerOptions) {
        
        this.server = new WS.Server({
            port: opts.port,
            verifyClient: this.onValidateConnection.bind(this) 
        });

        this.server.on("connection",(socket)=> {
            let clientId = ClientID.getNewId();
            let client = new Client(clientId, socket);
            this.connectedClients.push(client);
            //Negotiate connection
            this.negotiateConnection(client);

            socket.on("message",(data: WS.Data) => {
                this.onWSMessage(data,client);
            });

            socket.on("error", (error: Error) => {
                this.onWSError(error, client);
            });

            socket.on("close",(code: number,message: string) => {
                this.onWSClose(code,message,clientId);
            });
        });
        
        if(opts.updateMode != "Epoch" && !opts.epochTickRate) {
            throw "Cannot define epoch tick rate when update mode is not epoch";
        }
    }

    public broadcast(data: any, sender ?: Client) {
        for (let i = 0; i < this.connectedClients.length; i++) {
            if(this.connectedClients[i].clientId==sender.clientId) continue;
            this.connectedClients[i].Send(data);
        }
    }
    private onWSMessage(data: any, client: Client) {
        //ToDo some unwrapping logic
        this.messageHandler.onMessage(data,client);
    }
    private onWSClose(code: number, message: string, clientId: string) {

    }
    private onWSError(error: Error, client: Client) {
        
    }
    private negotiateConnection(client: Client) {
        
    }
}