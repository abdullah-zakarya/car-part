import { socketServer } from "../../../../socket";
import Message from "../MessageModel";

export interface IWebSocketClient {
    sendMessage(msg: Pick<Message, "senderId" | "receiverId" | "message">): void;

}