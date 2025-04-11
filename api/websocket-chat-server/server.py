import asyncio
import websockets
import json
from aiohttp import web

connected_users = {}

async def handle_connection(websocket):
    user_id = None
    try:
        async for message in websocket:
            data = json.loads(message)

            if "id" in data and "name" in data and "userIds" in data and "messages" in data and "unread" in data:
                for target_user_id in data["userIds"]:
                    if target_user_id in connected_users:
                        await connected_users[target_user_id].send(json.dumps(data))
            elif "user_id" in data:
                user_id = data["user_id"]
                connected_users[user_id] = websocket
                await websocket.send(json.dumps({"status": "success", "message": f"User {user_id} connected."}))
            else:
                await websocket.send(json.dumps({"error": "Invalid JSON structure"}))
    except websockets.exceptions.ConnectionClosedError:
        print(f"User {user_id} disconnected.")
    finally:
        if user_id:
            connected_users.pop(user_id, None)

async def health_check(request):
    return web.Response(text="WebSocket server is up!")

async def start_servers():
    # Inicia o WebSocket
    websocket_server = websockets.serve(handle_connection, "0.0.0.0", 8765)

    # Inicia o HTTP pra enganar o Render
    app = web.Application()
    app.router.add_get("/", health_check)
    runner = web.AppRunner(app)
    await runner.setup()
    http_site = web.TCPSite(runner, "0.0.0.0", 10000)

    await asyncio.gather(websocket_server, http_site.start())

asyncio.run(start_servers())
