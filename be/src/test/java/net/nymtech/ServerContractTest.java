package net.nymtech;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import org.awaitility.Awaitility;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.nymtech.request.Request;
import net.nymtech.response.Response;

final class ServerContractTest {

  private static final ObjectMapper objectMapper = new ObjectMapper();
  private static Server server;
  private static HashMap<UUID, Response> responsesReceived = new HashMap<UUID, Response>();

  @BeforeAll
  static void setUp() throws InterruptedException {
    var properties = new Properties();
    properties.setProperty("nym-client-url", "ws://127.0.0.1:1977");
    properties.setProperty("base-path", Paths.get("src", "test", "resources", "base-path").toAbsolutePath().toString());
    server = new Server(properties, List.of((id, r) -> responsesReceived.put(id, r)));
    server.run();
  }

  @BeforeEach
  void refresh() {
    responsesReceived.clear();
  }

  @AfterAll
  static void cleanUp() throws IOException {
    var basePath = Paths.get("src", "test", "resources", "base-path");
    if (Files.exists(basePath)) {
      Files.walk(basePath)
          .sorted((path1, path2) -> path2.compareTo(path1))
          .forEach(path -> {
            try {
              Files.delete(path);
            } catch (IOException e) {
              throw new RuntimeException("Failed to delete: " + path, e);
            }
          });
    }
    server.stop();
  }

  @Test
  void should_Upload_File() throws Exception {
    // given

    // when
    sendTestUploadFileRequest(server.getNymClient());

    // then
    var expectedResponseContent = objectMapper.writeValueAsBytes(
        objectMapper.createObjectNode().put("path", "/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title"));
    var expectedResponse = new Response(Response.Status.SUCCESSFUL, expectedResponseContent);
    Awaitility.await()
        .atMost(Duration.ofSeconds(10))
        .with()
        .pollInterval(Duration.ofMillis(250))
        .until(() -> {
          if (responsesReceived.size() != 1) {
            return false;
          }
          var actualResponse = responsesReceived.get(UUID.fromString("6f0bb35c-b473-4a12-ab5e-5a5efc7e85ff"));
          return actualResponse.equals(expectedResponse);
        });
  }

  private static void sendTestUploadFileRequest(NymClient nymClient) throws IOException {
    var selfAddress = nymClient.getSelfAddress();
    var content = objectMapper.createObjectNode();
    content.put("userId", "27aefbf2-9afa-4c24-a60d-564fbf8d0916");
    content.put("title", "test-title");
    content.put("content", testFile());
    var request = new Request(
        UUID.fromString("6f0bb35c-b473-4a12-ab5e-5a5efc7e85ff"), Request.Type.UPLOAD_FILE,
        selfAddress, objectMapper.writeValueAsBytes(content));

    var requestLength = 21 + selfAddress.length + 4 + request.content().length;
    var bufferSize = 1 + request.clientAddress().length + (2 * Long.BYTES) + requestLength;
    var buffer = ByteBuffer.allocate(bufferSize);

    // Request tag + client address + connection ID + request length
    buffer.put((byte) 0x00);
    buffer.put(request.clientAddress());
    buffer.putLong(0L);
    buffer.putLong(requestLength);
    // Request itself
    buffer.putLong(request.id().getMostSignificantBits());
    buffer.putLong(request.id().getLeastSignificantBits());
    buffer.put((byte) request.type().value());
    buffer.putInt(selfAddress.length);
    buffer.put(selfAddress);
    buffer.putInt(request.content().length);
    buffer.put(request.content());

    buffer.flip();

    nymClient.makeSendRequest(buffer);
  }

  private static byte[] testFile() throws IOException {
    try (var iStream = Main.class.getClassLoader().getResourceAsStream("test-file.txt")) {
      return iStream.readAllBytes();
    }
  }

}
