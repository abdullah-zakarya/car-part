import amqp, { Message as RabbitMessage } from "amqplib";
import { Server } from "socket.io";
import { sendMessageToUser } from "./socket";

export async function connectRabbitMQ(io: Server) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    const queue = "chat.message";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg:) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        // expected: { senderId, receiverId, message }
        sendMessageToUser(io, content.receiverId, {
          from: content.senderId,
          message: content.message,
        });
        channel.ack(msg);
      }
    });

    console.log("RabbitMQ connected and consuming messages");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ", err);
  }
}