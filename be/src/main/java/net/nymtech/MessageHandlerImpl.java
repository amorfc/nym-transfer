package net.nymtech;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import jakarta.websocket.MessageHandler;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.RequestHandler;
import net.nymtech.request.Request;
import net.nymtech.request.RequestDeserializer;

@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
@Log4j2
final class MessageHandlerImpl implements MessageHandler.Whole<ByteBuffer> {

  private final Map<Request.Type, RequestHandler> handlers;

  @Override
  public void onMessage(ByteBuffer message) {
    try {
      String messageUtf8Decoded = new String(message.array(), StandardCharsets.UTF_8);
      log.info("Received message UTF-8 decoded: '{}'", messageUtf8Decoded);

      // TODO: Change the exception thrown with a custome one.
      var deserializedMessage = RequestDeserializer.deserialize(message);
      log.info("Deserialization successful: {}", deserializedMessage);

      if (!handlers.containsKey(deserializedMessage.type())) {
        log.warn("Handler couldn't be extracted: {}", deserializedMessage.type());
        return;
      }
      handlers.get(deserializedMessage.type()).handle(deserializedMessage);
    } catch (IllegalArgumentException e) {
      log.error("Deserialization unsuccessful, bytes: {}", Arrays.toString(message.array()), e);
    } catch (Exception e) {
      log.error("Something went wrong!", e);
    }
  }

}
