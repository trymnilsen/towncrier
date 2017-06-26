export abstract class Codec {
    abstract Encode(data: any): any;
    abstract Decode(data: any): Object;
}