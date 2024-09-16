package net.nymtech;

import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Log4j2
final class EndpointImpl extends Endpoint {

  private Session session = null;

  static EndpointImpl instance = new EndpointImpl();

  @Override
  public void onOpen(Session session, EndpointConfig config) {
    this.session = session;
    this.session.addMessageHandler(MessageHandlerImpl.instance);
    log.info("Connection with NYM Client is established successfully!");
  }

}
