import { WebSocketServer } from "ws";
import * as dotenv from 'dotenv'
dotenv.config();

const host = process.env.WS_SERVER;  
const port: number = parseInt(process.env.WS_PORT || '8080');

const wss = new WebSocketServer({ host, port });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;

  console.log(`Client connected: ${clientIp}`);

  ws.on('message', (message: string) => {
    console.log('Receivedd: %s', message);

    let textMessage: string;

    if (Buffer.isBuffer(message)) {
      textMessage = message.toString();
    } else if (typeof message === 'string') {
      textMessage = message;
    } else {
      console.error('Unsupported message type:', typeof message);
      return;
    }

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        const msg = JSON.stringify({ message: textMessage, ip: clientIp });
        client.send(msg);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
})

console.log(`WebSocket server running on ws://${host}:${port}`);