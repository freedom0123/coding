# WebSocket

传统的 HTTP 请求通常是一次请求和一次响应，而请求则是由浏览器主动发起的，而 WebSocket 则可以建立一个长连接，允许服务端即时想

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

创建配置类：

> 我们这里的核心就是要创建 **WebSocketConfigurer**, 而这个对象的核心又分为两个部分：Handler 和 Interceptor

```java
@Configuration
@EnableWebSocket // 启动 WebSocket 
public class WebSocketConfig {

    @Bean
    public WebSocketConfigurer webSocketConfigurer(WebSocketHandler webSocketHandler, HandshakeInterceptor[] handshakeInterceptors) {
        return registry -> registry
                .addHandler(webSocketHandler, "/coding-websocket/**")
                .addInterceptors(handshakeInterceptors)
                .setAllowedOrigins("*");
    }

    @Bean
    public HandshakeInterceptor[] handshakeInterceptors(LoginUserHandInterceptor loginUserHandInterceptor) {
        return new HandshakeInterceptor[]{loginUserHandInterceptor};
    }

    @Bean
    public WebSocketHandler webSocketHandler(WebSocketManager webSocketManager) {
        CodingWebSocketHandler codingWebSocketHandler = new CodingWebSocketHandler();
        return new WebSocketSessionHandlerDecorator(codingWebSocketHandler, webSocketManager);
    }
}
```

​                                                                                                                                                                                                                                                                                                                                                                               

```java
@Slf4j
public class CodingWebSocketHandler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.info("接受到的信息为：{}", message);
    }
}
```





```java
@Slf4j
public class WebSocketSessionHandlerDecorator extends WebSocketHandlerDecorator {

    private final WebSocketManager webSocketManager;

    public WebSocketSessionHandlerDecorator(WebSocketHandler delegate, WebSocketManager webSocketManager) {
        super(delegate);
        this.webSocketManager = webSocketManager;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("用户连接上来了: {}", session);
        webSocketManager.addSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        log.info("连接断开: {}", session);
        webSocketManager.removeSession(session);
    }
}
```

