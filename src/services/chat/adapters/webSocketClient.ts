// adapters/RabbitMQWebSocketClient.ts

import { IWebSocketClient } from "../Interfaces/IWebSocketClient";
import Message from "../MessageModel";
import WebSocketServer from "../../../../socket";

export class webSocketClient implements IWebSocketClient {
    socket: WebSocketServer;
    constructor() {
        this.socket = WebSocketServer.getInstance();
    }
    sendMessage(msg: Pick<Message, "senderId" | "receiverId" | "message">): void {
        this.socket.sendMessage(msg);
    }
}