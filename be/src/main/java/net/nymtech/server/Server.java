package net.nymtech.server;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
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
import net.nymtech.server.handler.download_file.DownloadFileHandler;
import net.nymtech.server.handler.upload_file.UploadFileHandler;
import net.nymtech.server.request.Request.Type;
import net.nymtech.server.response.Response;

@RequiredArgsConstructor
@Log4j2
public final class Server {

  private static final int BOOTSTRAP_TRY_COUNT = 3;
  private static final int TIMEOUT_SECONDS = 10;

  private static final ExecutorService executor = Executors.newSingleThreadExecutor();
  private final CountDownLatch runningLatch = new CountDownLatch(1);
  private final CountDownLatch sessionInitiatedLatch = new CountDownLatch(1);
  private final AtomicBoolean isRunning = new AtomicBoolean(false);
  private final Properties properties;
  private final List<BiConsumer<UUID, Response>> sentResponseConsumers;
  @Getter(AccessLevel.PACKAGE) // Testing purposes
  private NymClient nymClient;

  public void run() throws InterruptedException {
    executor.submit(() -> {
      try {
        log.info("Server is being started...");
        isRunning.set(true);

        connectToNymClient();

        runningLatch.await();
        log.info("Server is stopped successfully!");
      } catch (Exception e) {
        log.error("Something went unexpectedly wrong!", e);
      }
    });

    log.info("Waiting for the connection...");
    if (!sessionInitiatedLatch.await(TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
      log.info("Connection couldn't be initiated in {} seconds, it's being stopped..",
          TIMEOUT_SECONDS);
      stop();
    }
  }

  public void stop() {
    if (isRunning.get()) {
      log.info("Server is being stopped...");
      isRunning.set(false);
      runningLatch.countDown();
      executor.shutdown();
    }
  }

  private void connectToNymClient()
      throws URISyntaxException, DeploymentException, IOException, InterruptedException {
    var endpoint = endpoint(properties);
    var config = ClientEndpointConfig.Builder.create().build();
    var nymClientUri = new URI(getPropertyOrThrow("nym-client-url"));
    var clientManager = ClientManager.createClient();

    int i = 0;
    do {
      try {
        Thread.sleep(Duration.ofSeconds(2 * i));
        log.info("Attempting for the connection for the {}. times...", ++i);
        clientManager.connectToServer(endpoint, config, nymClientUri);
        break;
      } catch (Exception e) {
        log.error("Connection attempt failed for the {}. times!", i, e);
      }
    } while (i < BOOTSTRAP_TRY_COUNT);
  }

  private Endpoint endpoint(Properties properties) {
    return new Endpoint() {
      // TODO: Only one session?
      @Override
      public void onOpen(Session session, EndpointConfig config) {
        nymClient = NymClient.build(session, sentResponseConsumers);
        session.addMessageHandler(messageHandler());
        sessionInitiatedLatch.countDown();
        log.info("Connection is successfully initiated!");
      }
    };
  }

  private MessageHandler.Whole<ByteBuffer> messageHandler() {
    var objectMapper = new ObjectMapper();
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
