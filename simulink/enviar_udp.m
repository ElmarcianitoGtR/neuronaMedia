function enviar_udp(payload_array)
    % Función auxiliar que utiliza sockets de Java (integrados en MATLAB).
    % Esto elimina por completo la necesidad de tener instalada la caja
    % de herramientas 'Instrument Control Toolbox' (que contiene udpport).
    
    persistent udpSocket address;
    
    if isempty(udpSocket)
        % Inicializar Socket UDP nativo de Java
        udpSocket = java.net.DatagramSocket();
        address = java.net.InetAddress.getByName('148.220.197.119');
    end
    
    % 1. Convertir los 9 enteros de 16 bits (uint16) a 18 bytes (uint8)
    % MATLAB en Windows trabaja en Little-Endian por defecto.
    bytes_raw = typecast(payload_array, 'uint8');
    
    % 2. Convertir a int8 porque Java utiliza bytes con signo (-128 a 127)
    java_bytes = typecast(bytes_raw, 'int8');
    
    % 3. Crear el datagrama y enviarlo al puerto 4000
    packet = java.net.DatagramPacket(java_bytes, length(java_bytes), address, 4000);
    udpSocket.send(packet);
end
