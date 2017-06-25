import * as WS from 'ws';
export class Client {
    public readonly clientId: string;
    public socket: WS;
    public constructor(clientId: string, socket: WS) {
         this.clientId = clientId;
         this.socket = socket;
    }
    public Send(data:any) {
        
    }
}