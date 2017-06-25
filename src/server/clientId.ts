import * as crypto from "crypto";

export class ClientID {
    private static currentIds: {[id:string]:boolean} = {};
    public static getNewId(): string {
        let id: string = null;
        do {
            let token = crypto.randomBytes(64).toString('base64');
            if(!ClientID.currentIds[token]) {
                id = token;
                ClientID.currentIds[token] = true;
            }
        } while(id === null)

        return id;
    }
}