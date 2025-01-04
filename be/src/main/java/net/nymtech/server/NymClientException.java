package net.nymtech.server;

/**
 * Represents the exceptions that might occur during {@link NymClient} executions.
 */
final class NymClientException extends RuntimeException {

  NymClientException() {
    super();
  }

  NymClientException(String message) {
    super(message);
  }

  NymClientException(String message, Throwable cause) {
    super(message, cause);
  }

  NymClientException(Throwable cause) {
    super(cause);
  }

}
