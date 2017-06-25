export interface ServerOptions {
    port: number;
    mode?: "Dedicated" | "RTC";
    updateMode?: "OnMessage" | "Epoch";
    epochTickRate?: number;
}