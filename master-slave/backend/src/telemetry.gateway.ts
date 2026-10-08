import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TelemetryGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    // Simulate OPC UA / MATLAB data arriving every 2 seconds
    setInterval(() => {
      const mockData = {
        oee: (60 + Math.random() * 30).toFixed(1), // 60.0 to 90.0
        productivity: Math.floor(60 + Math.random() * 35), // 60 to 95
        targetUnits: 1284,
        actualUnits: Math.floor(800 + Math.random() * 200),
      };
      this.broadcastTelemetry(mockData);
    }, 2000);
  }

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
