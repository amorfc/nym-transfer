package net.nymtech;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

import jakarta.websocket.MessageHandler;
import jakarta.websocket.Session;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.RequestHandler;
import net.nymtech.request.Request;
import net.nymtech.request.RequestDeserializer;
import net.nymtech.response.Response;
import net.nymtech.response.ResponseSerializer;

@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
@Log4j2
final class NymClient {

  private static final byte RESPONSE_TAG_SELF_ADDRESS = 0x02;
  private static final byte RESPONSE_TAG_RECEIVED = 0x01;
  private static final byte RESPONSE_TAG_ERROR = 0x00;

  private final Session session;
  private final CountDownLatch selfAddressFetchLatch;
  private final List<BiConsumer<UUID, Response>> sentResponseConsumers;
  private byte[] selfAddress = null;

  static NymClient build(Session session, List<BiConsumer<UUID, Response>> sentResponseConsumers) {
    Objects.requireNonNull(session, "session cannot be null!");

    List<BiConsumer<UUID, Response>> _sentResponseConsumers = sentResponseConsumers == null ? Collections.emptyList()
        : Collections.unmodifiableList(sentResponseConsumers);

    return new NymClient(session, new CountDownLatch(1), _sentResponseConsumers);
  }

  public void makeSendRequest(ByteBuffer payload) {
    try {
      maybeSetSelfAddress();
      session.getBasicRemote().sendBinary(payload);
    } catch (IOException | InterruptedException e) {
      throw new NymClientException("Send request failed!", e);
    }
  }

  byte[] getSelfAddress() {
    try {
      maybeSetSelfAddress();
      return selfAddress;
    } catch (IOException | InterruptedException e) {
      throw new NymClientException("Self address request failed!", e);
    }
  }

  private synchronized void maybeSetSelfAddress() throws IOException, InterruptedException {
    if (selfAddress == null) {
      session.getBasicRemote().sendBinary(ByteBuffer.wrap(new byte[] { 0x03 }));
      if (!selfAddressFetchLatch.await(3, TimeUnit.SECONDS)) {
        throw new NymClientException("Self address couldn't be received in 3 seconds!");
      }
    }
  }

  private void invokeConsumers(UUID requestId, Response response) {
    for (var consumer : sentResponseConsumers) {
      try {
        consumer.accept(requestId, response);
      } catch (Exception e) {
        log.debug("Exception occurred during execution of {} with {} & {}", consumer.getClass().getName(), requestId,
            response, e);
      }
    }
  }

  @RequiredArgsConstructor(access = AccessLevel.PACKAGE)
  final class MessageHandlerImpl implements MessageHandler.Whole<ByteBuffer> {

    private final Map<Request.Type, RequestHandler> handlers;

    @Override
    public void onMessage(ByteBuffer message) {
      if (message.get(0) == RESPONSE_TAG_SELF_ADDRESS) {
        handleSelfAddress(message);
      } else if ((message.get(0) == RESPONSE_TAG_RECEIVED || message.get(0) == RESPONSE_TAG_ERROR)
          && selfAddress == null) {
        log.warn("Self address has not been fetched yet, message is being ignored!");
      } else if (message.get(0) == RESPONSE_TAG_RECEIVED) {
        handleReceived(message);
      } else if (message.get(0) == RESPONSE_TAG_ERROR) {
        handleError(message);
      } else {
        log.warn("Unexpected type of response {}, message is being ignored: '{}'", message.get(0),
            Arrays.toString(message.array()));
      }
    }

    private void handleSelfAddress(ByteBuffer message) {
      selfAddress = new byte[message.limit() - 1];
      message.get(1, selfAddress);
      selfAddressFetchLatch.countDown();
      log.info("Self address received successfully!");
    }

    private void handleReceived(ByteBuffer message) {
      try {
        var deserializedRequest = RequestDeserializer.deserialize(message);
        log.debug("Deserialization successful: {}", deserializedRequest);

        if (!handlers.containsKey(deserializedRequest.type())) {
          log.warn("Handler couldn't be extracted: {}", deserializedRequest.type());
          return;
        }
        var response = handlers.get(deserializedRequest.type()).handle(deserializedRequest.id(),
            deserializedRequest.content());

        var serializedResponse = ResponseSerializer.serialize(deserializedRequest.clientAddress(),
            deserializedRequest.id(), response.status(), response.content());
        makeSendRequest(serializedResponse);
        invokeConsumers(deserializedRequest.id(), response);
      } catch (IllegalArgumentException e) {
        log.error("Deserialization unsuccessful, bytes: {}", Arrays.toString(message.array()), e);
      } catch (Exception e) {
        log.error("Something went unexpectedly wrong!", e);
      }
    }

    private static void handleError(ByteBuffer message) {
      log.debug("Error response: '{}'", new String(message.array()));
    }

  }

}
