package net.nymtech;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;
import org.glassfish.tyrus.client.ClientManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.DeploymentException;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.MessageHandler;
import jakarta.websocket.Session;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.download_file.DownloadFileHandler;
import net.nymtech.handler.upload_file.UploadFileHandler;
import net.nymtech.request.Request.Type;
import net.nymtech.response.Response;

@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
@Log4j2
final class Server {

  private static final ExecutorService executor = Executors.newSingleThreadExecutor();
  private static final ObjectMapper objectMapper = new ObjectMapper();
  private final CountDownLatch runningLatch = new CountDownLatch(1);
  private final CountDownLatch sessionInitiatedLatch = new CountDownLatch(1);
  private final Properties properties;
  private final List<BiConsumer<UUID, Response>> sentResponseConsumers;
  @Getter(AccessLevel.PACKAGE) // Testing purposes
  private NymClient nymClient;

  void run() throws InterruptedException {
    executor.submit(() -> {
      try {
        log.info("Server is running...");

        connectToNymClient();
        log.info("Server bootstrap completed successfully!");

        runningLatch.await();
        log.info("Server is stopped successfully!");
      } catch (Exception e) {
        log.error("Something went unexpectedly wrong!", e);
      }
    });

    if (!sessionInitiatedLatch.await(5, TimeUnit.SECONDS)) {
      executor.shutdownNow();
      throw new RuntimeException("Session couldn't be initiated in 5 seconds!");
    }
  }

  void stop() {
    log.info("Server is being stopped...");
    runningLatch.countDown();
  }

  private void connectToNymClient() throws URISyntaxException, DeploymentException, IOException {
    var endpoint = endpoint(properties);
    var config = ClientEndpointConfig.Builder.create().build();
    var nymClientUri = new URI(getPropertyOrThrow("nym-client-url"));
    var clientManager = ClientManager.createClient();
    clientManager.connectToServer(endpoint, config, nymClientUri);
  }

  private Endpoint endpoint(Properties properties) {
    return new Endpoint() {
      // TODO: Only one session?
      @Override
      public void onOpen(Session session, EndpointConfig config) {
        nymClient = NymClient.build(session, sentResponseConsumers);
        session.addMessageHandler(messageHandler());
        sessionInitiatedLatch.countDown();
        log.info("Connection with NYM Client is established successfully!");
      }
    };
  }

  private MessageHandler.Whole<ByteBuffer> messageHandler() {
    var basePath = getPropertyOrThrow("base-path");
    var uploadFileHandler = new UploadFileHandler(objectMapper, basePath);
    var downloadFileHandler = new DownloadFileHandler(objectMapper, basePath);
    var handlers =
        Map.of(Type.UPLOAD_FILE, uploadFileHandler, Type.DOWNLOAD_FILE, downloadFileHandler);
    return this.nymClient.new MessageHandlerImpl(handlers);
  }

  private String getPropertyOrThrow(String key) {
    if (!properties.containsKey(key)) {
      throw new IllegalArgumentException("%s couldn't extracted!".formatted(key));
    }
    return properties.getProperty(key);
  }

}
