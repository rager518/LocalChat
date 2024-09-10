import { WebSocketServer } from "ws";
import * as dotenv from 'dotenv'
import * as fs from 'fs';

dotenv.config();

const host = process.env.WS_SERVER;
const port: number = parseInt(process.env.WS_PORT || '8080');

const wss = new WebSocketServer({ host, port });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;

  console.log(`Client connected: ${clientIp}`);

  ws.on('message', (data: any) => {
    let textMessage: string;

    try {
      const msg = JSON.parse(data.toString());
      const { type, content } = msg;

      if (type) {
        if (Buffer.isBuffer(content)) {
          textMessage = content.toString();
        } else if (typeof content === 'string') {
          textMessage = content;
        } else {
          console.error('Unsupported message type:', typeof content);
          return;
        }
      }

    } catch (err) {

      const dataView = new Uint8Array(data);

      const lengthView = new DataView(dataView.buffer, dataView.byteOffset, dataView.byteLength);
      const fileNameLength: number = lengthView.getUint16(0, true);

      const fileNameBytes = dataView.slice(2, 2 + fileNameLength);
      const fileName = new TextDecoder().decode(fileNameBytes).trim();

      console.log('Received file name:', fileName);

      const fileContent = dataView.slice(2 + fileNameLength);
      const filePath = `dist/${fileName}`;
      textMessage = filePath;
      fs.writeFile(filePath, Buffer.from(fileContent), (err) => {
        if (err) {
          console.error('Error saving file:', err);
        } else {
          console.log('File saved successfully');
        }
      });
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