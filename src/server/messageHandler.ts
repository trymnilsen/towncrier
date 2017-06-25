import { Client } from './client';
export interface MessageHandler {
    onMessage(data: any, client: Client);
}