import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  // This will be called by the OPC UA / MATLAB service to send data to React
  broadcastTelemetry(data: any) {
    this.server.emit('telemetry_update', data);
  }

  // Example Ping/Pong to check connection
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: string): string {
    return 'pong';
  }
}
