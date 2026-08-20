export default {
  async fetch(request) {
    // 只处理 WebSocket 升级请求
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    // 建立 WebSocket 连接
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    // 存储所有连接的客户端
    const clients = new Set();
    clients.add(server);

    // 收到消息时广播给所有客户端（包括发送者自己，但前端可以去重）
    server.addEventListener('message', (event) => {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(event.data);
        }
      });
    });

    // 客户端断开时清理
    server.addEventListener('close', () => {
      clients.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }
};
