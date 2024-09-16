package net.nymtech;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Map;
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
import net.nymtech.request.Request;

@Log4j2
final class Main {

  private static final String URL_NYM_CLIENT = "ws://127.0.0.1:1977";

  private static final CountDownLatch runningLatch = new CountDownLatch(1);
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static void main(String[] args) throws InterruptedException {
    log.info("Server is running...");

    try {
      var endpoint = endpoint();
      var config = ClientEndpointConfig.Builder.create().build();
      var clientManager = ClientManager.createClient();
      clientManager.connectToServer(endpoint, config, new URI(URL_NYM_CLIENT));

      runningLatch.await();
      log.info("Server is stopped successfully!");
    } catch (Exception e) {
      log.error("Something went wrong!", e);
    }
  }

  void stop() {
    log.info("Server is being stopped...");
    runningLatch.countDown();
  }

  private static Endpoint endpoint() {
    return new Endpoint() {
      // TODO: Do we need only one session?
      @Override
      public void onOpen(Session session, EndpointConfig config) {
        session.addMessageHandler(messageHandler(session));
        log.info("Connection with NYM Client is established successfully!");
      }
    };
  }

  private static MessageHandler.Whole<ByteBuffer> messageHandler(Session session) {
    Map<Request.Type, RequestHandler> handlers =
        Map.of(Request.Type.UPLOAD_FILE, new UploadFileHandler(objectMapper, session));
    return new MessageHandlerImpl(handlers);
  }

}
