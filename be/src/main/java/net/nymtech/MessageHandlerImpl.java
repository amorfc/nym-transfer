package net.nymtech;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import jakarta.websocket.MessageHandler;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Log4j2
final class MessageHandlerImpl implements MessageHandler.Whole<ByteBuffer> {

  static MessageHandlerImpl instance = new MessageHandlerImpl();

  @Override
  public void onMessage(ByteBuffer message) {
    try {
      String messageUtf8Decoded = new String(message.array(), StandardCharsets.UTF_8);
      log.info("Received message UTF-8 decoded: '{}'", messageUtf8Decoded);
    } catch (Exception e) {
      log.error("Something went wrong!", e);
    }
  }

}
