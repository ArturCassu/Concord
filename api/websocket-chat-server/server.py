import asyncio
import websockets
import json

connected_users = {}  # Mapeia user_id para websockets

async def handle_connection(websocket):
    user_id = None
    try:
        async for message in websocket:
            data = json.loads(message)

            # tem que ter todos os campos necessariamente pq se nao da a porra de invalid arguments
            if "id" in data and "name" in data and "userIds" in data and "messages" in data and "unread" in data:
                # todo mundo que tiver no campo userIds vai receber a mensagem
                for target_user_id in data["userIds"]:
                    if target_user_id in connected_users:
                        target_websocket = connected_users[target_user_id]
                        await target_websocket.send(json.dumps(data))
            elif "user_id" in data:  # Conexão inicial para registrar o usuário
                user_id = data["user_id"]
                connected_users[user_id] = websocket
                await websocket.send(json.dumps({"status": "success", "message": f"User {user_id} connected."}))
            else:
                # se a api receber um json que nao tem os campos obrigatorios ela vai retornar o erro aqui de baixo
                await websocket.send(json.dumps({"error": "Invalid JSON structure"}))
    except websockets.exceptions.ConnectionClosedError:
        print(f"User {user_id} disconnected.")
    finally:
        if user_id:
            connected_users.pop(user_id, None)

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        print("Servidor WebSocket rodando em ws://localhost:8765")
        await asyncio.Future()

asyncio.run(main())