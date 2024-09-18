package net.nymtech;

import java.io.IOException;
import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import org.glassfish.tyrus.client.ClientManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.MessageHandler;
import jakarta.websocket.Session;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.RequestHandler;
import net.nymtech.handler.upload_file.UploadFileHandler;
import net.nymtech.request.Request.Type;

@Log4j2
final class Main {

  private static final String URL_NYM_CLIENT = "ws://127.0.0.1:1977";

  private static final CountDownLatch runningLatch = new CountDownLatch(1);
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static void main(String[] args) throws Exception {
    log.info("Server is running...");

    var properties = loadProperties();
    var endpoint = endpoint(properties);
    var config = ClientEndpointConfig.Builder.create().build();
    var clientManager = ClientManager.createClient();
    clientManager.connectToServer(endpoint, config, new URI(URL_NYM_CLIENT));

    runningLatch.await();
    log.info("Server is stopped successfully!");
  }

  void stop() {
    log.info("Server is being stopped...");
    runningLatch.countDown();
  }

  private static Properties loadProperties() throws IOException {
    try (var iStream = Main.class.getClassLoader().getResourceAsStream("application.properties")) {
      var properties = new Properties();
      properties.load(iStream);
      return properties;
    } catch (IOException e) {
      log.error("application.properties couldn't be loaded!", e);
      throw e;
    }
  }

  private static Endpoint endpoint(Properties properties) {
    if (!properties.containsKey("base-path")) {
      throw new IllegalArgumentException("base-path couldn't extracted!");
    }

    return new Endpoint() {
      // TODO: Do we need only one session?
      @Override
      public void onOpen(Session session, EndpointConfig config) {
        session.addMessageHandler(messageHandler(session, properties.getProperty("base-path")));
        log.info("Connection with NYM Client is established successfully!");
      }
    };
  }

  private static MessageHandler.Whole<ByteBuffer> messageHandler(Session session, String basePath) {
    var uploadFileHandler = new UploadFileHandler(objectMapper, basePath, session);
    Map<Type, RequestHandler> handlers = Map.of(Type.UPLOAD_FILE, uploadFileHandler);
    return new MessageHandlerImpl(handlers);
  }

}
