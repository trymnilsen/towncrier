import { Test } from './test';
export class Client {
    private booleanValue: boolean = true;
    public constructor() {
        let test = new Test();
        test.fooBar();
        let func = ()=> {

        };
    }
    public barFoo<T>(args: Array<T>): boolean {
        return this.booleanValue;
    }
}

let client: Client = new Client();