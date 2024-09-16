package net.nymtech.handler;

import net.nymtech.request.Request;

/**
 * Represents the API that can be called through NYM Mixnet.
 */
public interface RequestHandler {

  /**
   * Handles the incoming request.
   * 
   * @param request incoming request
   */
  void handle(Request request);

}
