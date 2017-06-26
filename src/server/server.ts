import { ServerOptions } from '../lib/ServerOptions';
import { Client } from './client';
import { EpochMessageHandler } from './epochMessageHandler';
import { ImmediateMessageHandler } from './immediateMessageHandler';
import { ClientID } from './clientId';
import { MessageHandler } from './messageHandler';
import * as WS from 'ws';
import { ClientConnectMessage } from '../lib/clientConnectMessage';
import { GameWorld } from './gameworld';
import { Codec } from '../lib/codec';

export class Server {
    private connectedClients: Client[];
    private server: WS.Server;
    private options: ServerOptions;
    private messageHandler: MessageHandler;
    private gameworld: GameWorld;
    private codec: Codec;
    public onMessage: (message: object) => void;
    public onClientConnect: (client: Client) => void;
    public onValidateConnection: (connection: any) => boolean;

    public constructor(opts: ServerOptions) {
        this.options = opts;

        this.server = new WS.Server({
            port: opts.port,
            verifyClient: this.onValidateConnection.bind(this) 
        });

        this.server.on("connection",async (socket)=> {
            let clientId = ClientID.getNewId();
            let client = new Client(clientId, socket);
            this.connectedClients.push(client);
            //Negotiate connection
            await this.negotiateConnection(client);

            socket.onmessage = (message) => {
                let unWrappedData = this.codec.Decode(message.data);
                this.messageHandler.onMessage(unWrappedData, client);
            };

            socket.onclose = (closeEvent)=> {
                this.onWSClose(closeEvent, clientId);
            };

            socket.onerror = (data) => {
                this.onWSError(data, client);
            };

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
    private onWSClose(closeEvent: {wasClean :boolean; code:number; reason:string;}, clientId: string) {

    }
    private onWSError(error: Error, client: Client) {
        
    }
    private async negotiateConnection(client: Client): Promise<void> {
        return new Promise<void>((resolve, error) => {
            let connectMessage: ClientConnectMessage = {
                clientId: client.clientId,
                connectedClients: this.gameworld.players,
                serverOptions: this.options
            };
            //Set up listener to await confirm
            client.socket.onmessage = (message)=> {
                if(message.data === client.clientId) {
                    client.socket.onmessage = null;
                    //Remove listener
                    resolve();
                } else {
                    client.socket.onmessage = null;
                    error("Client confirmed with incorrect ID");
                }
            };
            //Send the client message
            client.socket.send(connectMessage,error);
        });
    }
}