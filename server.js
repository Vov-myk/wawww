export default {
  async fetch(request) {
    // 检查请求头，确认这是一个 WebSocket 升级请求
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    // 创建 WebSocket 连接对
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    // 当收到消息时，原样返回给客户端 (回声功能)
    server.addEventListener('message', (event) => {
      server.send(event.data);
    });

    // 返回 101 状态码，表示协议切换成功
    return new Response(null, { status: 101, webSocket: client });
  }
};
