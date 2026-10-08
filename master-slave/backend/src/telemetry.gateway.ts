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
    // The ModbusService will now trigger the broadcast.
  }

  // This will be called by the OPC UA / MATLAB service to send data to React
  broadcastTelemetry(data: any) {
    this.server.emit('telemetry_update', data);
  }

  broadcastAnomaly(alert: any) {
    this.server.emit('anomaly_alert', alert);
  }

  // Example Ping/Pong to check connection
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: string): string {
    return 'pong';
  }
}
