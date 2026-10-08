% Inicialización de Parámetros para la Inyectora
disp('Inicializando variables de simulación de inyección');

%% 1. Tiempos del Ciclo de Inyección en segundos
t_cierre = 2.0;
t_inyeccion = 3.0;
t_mantenimiento = 4.0;
t_enfriamiento = 10.0;
t_apertura = 2.0;

%% 2. Parámetros Físicos Nominales
T_nom = 220; % Temperatura Nominal del barril (°C)
P_nom = 120; % Presión Nominal de inyección (bar)

%% 3. Umbrales de Falla
T_max_fault = 240; % °C para disparar alarma térmica (Scrap)
T_min_fault = 190; % °C para disparar alarma térmica (Scrap)
P_min_fault = 80;  % bar para disparar alarma de presión (Tiro Corto)

%% 4. Dimensiones Mecánicas en metros
molde_largo = 0.5;
molde_ancho = 0.5;
molde_alto = 0.3;
carrera_apertura = 0.4; % Distancia que abre la mitad móvil del molde

%% 5. Configuración de Red via sockets UDP
udp_ip = '148.220.197.119'; % IP del servidor
udp_port = 4000;      % Puerto de escucha
