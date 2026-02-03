# 🎮 Real-Time Multiplayer Web Card Game

Aplicación web multijugador en tiempo real desarrollada con arquitectura **cliente–servidor**, donde los jugadores pueden crear partidas, unirse, esperar en sala y jugar mientras el estado se sincroniza mediante **WebSockets**.

Este proyecto demuestra integración completa entre **frontend moderno**, **backend con API REST**, y **comunicación en tiempo real**.

---

## 🚀 Demo Concepto

El sistema permite:

- Registro de jugador al iniciar la app  
- Listado de partidas disponibles  
- Unión a partidas existentes  
- Sala de espera con jugadores conectados  
- Inicio de partida multijugador  
- Sincronización en tiempo real del estado del juego  

El **backend actúa como fuente de verdad**, mientras que el frontend refleja los cambios en vivo.

---

## 🧠 Tecnologías utilizadas

### 🎨 Frontend
- React  
- React Router (navegación por rutas)  
- WebSockets (cliente)  
- CSS  
- Vite  

### ⚙️ Backend
- FastAPI (Python)  
- WebSockets (servidor)  
- SQLite  
- API REST para gestión de partidas y jugadores  

---

## 🗺️ Arquitectura del proyecto
- /frontend → Aplicación React (UI + lógica cliente)
- /backend → API REST + WebSocket Server (FastAPI)


### Flujo general:

1. El usuario ingresa su nombre en la pantalla inicial  
2. El frontend abre una conexión WebSocket con el servidor  
3. El jugador puede:
   - Crear partida  
   - Unirse a una existente  
4. El backend gestiona:
   - Estado de partidas  
   - Jugadores conectados  
   - Eventos en tiempo real  
5. Los cambios se notifican instantáneamente a todos los jugadores conectados  

---

## 🧭 Rutas principales (Frontend)

| Ruta | Componente | Función |
|------|------------|---------|
| `/` | Homepage | Ingreso de usuario y conexión al servidor |
| `/games` | GameList | Lista de partidas disponibles |
| `/waiting/:gameId` | WaitingRoom | Sala de espera con jugadores conectados |
| `/match/:gameId` | Match | Pantalla principal del juego |

---

## 🔌 Comunicación en tiempo real

Se utiliza **WebSocket** para:

- Conectar jugadores al servidor  
- Notificar creación de partidas  
- Actualizar jugadores en salas  
- Sincronizar acciones dentro del juego  
- Reflejar cambios de estado sin recargar la página  

Esto permite una experiencia similar a un juego online en tiempo real.

---

## 👨‍💻 Conceptos técnicos aplicados

- Arquitectura cliente–servidor  
- Manejo de estado en aplicaciones React  
- Navegación por rutas (SPA)  
- Comunicación bidireccional con WebSockets  
- Separación de responsabilidades frontend/backend  
- Consumo de API REST  
- Sincronización de múltiples clientes  

---

## ▶️ Cómo ejecutar el proyecto

### Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_PROYECTO>
```

### Backned
```bash
cd Back

python -m venv venv

# Activar entorno
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```
Servidor backend: http://localhost:8000
### Frontend
```bash
cd Front

npm install
npm run dev
```
Frontend: http://localhost:8080

### Ejecutar Test Unitarios
Backend:
```
cd Back/
python -m pytest
```
Frontend:
```
cd Front/
npx vitest run
```
### Variables de entorno (Frontend)

Crear un archivo .env:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Objetivo del proyecto

Este proyecto fue desarrollado para practicar y demostrar:
- Desarrollo de aplicaciones web en tiempo real
- Integración de React con un backend moderno
- Diseño de sistemas multijugador
- Gestión de estado distribuido entre múltiples clientes
