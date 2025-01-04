package net.nymtech.server.handler;

import java.util.UUID;
import net.nymtech.server.response.Response;

/**
 * Represents the API that can be called through NYM Mixnet.
 */
public interface RequestHandler {

  /**
   * Handles the incoming request.
   * 
   * @param requestContent incoming request
   * @return response to the request
   */
  Response handle(UUID requestId, byte[] requestContent);

}
