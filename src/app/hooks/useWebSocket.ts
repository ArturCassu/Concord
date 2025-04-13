import { useEffect, useRef } from "react";

const useWebSocket = (url: string, onMessage: (data: any) => void) => {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error("Failed to parse WebSocket message", e);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open.");
        }
    };

    return sendMessage;
};

export default useWebSocket;
