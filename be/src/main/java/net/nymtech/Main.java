package net.nymtech;

import java.net.URI;
import java.util.concurrent.CountDownLatch;
import org.glassfish.tyrus.client.ClientManager;
import jakarta.websocket.ClientEndpointConfig;
import lombok.extern.log4j.Log4j2;

@Log4j2
final class Main {

  private static final String URL_NYM_CLIENT = "ws://127.0.0.1:1977";

  private static final CountDownLatch runningLatch = new CountDownLatch(1);

  public static void main(String[] args) throws InterruptedException {
    log.info("Server is running...");

    try {
      var clientEndpointConfig = ClientEndpointConfig.Builder.create().build();
      var nymClientUri = new URI(URL_NYM_CLIENT);
      var clientManager = ClientManager.createClient();
      clientManager.connectToServer(EndpointImpl.instance, clientEndpointConfig, nymClientUri);

      runningLatch.await();
      log.info("Server is stopped successfully!");
    } catch (Exception e) {
      log.error("Something went wrong during bootstrap!", e);
    }
  }

  void stop() throws InterruptedException {
    log.info("Server is being stopped...");
    runningLatch.await();
  }

}
