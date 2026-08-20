const WebSocket = require('ws');

// 监听 Render 分配的环境变量 PORT
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('新客户端连接');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log('收到消息:', message.toString());
        // 广播给所有客户端
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('客户端断开');
    });
});

console.log('WebSocket 服务器已启动，端口:', process.env.PORT || 8080);
