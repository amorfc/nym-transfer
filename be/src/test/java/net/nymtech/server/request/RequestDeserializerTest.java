package net.nymtech.server.request;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.core.JsonProcessingException;

final class RequestDeserializerTest {

  @Test
  void should_Deserialize_Given_ByteBuffer() throws IOException {
    // given
    var message = buildTestMessage();

    // when
    var actual = RequestDeserializer.deserialize(message);

    // then
    var expectedId = UUID.fromString("6f0bb35c-b473-4a12-ab5e-5a5efc7e85ff");
    var expectedType = Request.Type.UPLOAD_FILE;
    assertThat(actual).usingRecursiveComparison().isEqualTo(new Request(expectedId, expectedType,
        new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9}, "Hello World!".getBytes()));
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_Payload_Size_Is_Shorter_Than_Expected()
      throws IOException {
    // given
    var message = ByteBuffer.wrap(new byte[25]);

    // when
    var actual = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(message));

    // then
    assertThat(actual.getMessage()).isEqualTo("Payload can't be smaller than 25 bytes!");
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_Request_Type_Is_Not_Valid()
      throws IOException {
    // given
    var message = ByteBuffer.wrap(new byte[35]);
    message.put(26, (byte) 0);

    // when
    var actual = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(message));

    // then
    assertThat(actual.getMessage()).isEqualTo("No type value exists for given byte: 0!");
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_Content_Length_Doesnt_Match_With_Number_Of_Content_Bytes()
      throws IOException {
    // given
    var message = ByteBuffer.wrap(new byte[35]);
    message.put(26, (byte) 1);
    message.putInt(31, 1);

    // when
    var actual = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(message));

    // then
    assertThat(actual.getMessage())
        .isEqualTo("Content length is not as expected, expected: 1, actual: 0");
  }

  private static ByteBuffer buildTestMessage() throws JsonProcessingException {
    var id = UUID.fromString("6f0bb35c-b473-4a12-ab5e-5a5efc7e85ff");
    var type = Request.Type.UPLOAD_FILE;
    var clientAddress = new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9};
    var content = "Hello World!".getBytes();

    var requestLength = 25 + clientAddress.length + content.length;
    var bufferSize = 10 + requestLength;
    var buffer = ByteBuffer.allocate(bufferSize);

    buffer.put((byte) 0x01); // response tag
    buffer.put((byte) 0x00); // has sender tag
    buffer.putLong(requestLength);
    buffer.putLong(id.getMostSignificantBits());
    buffer.putLong(id.getLeastSignificantBits());
    buffer.put((byte) type.value());
    buffer.putInt(clientAddress.length);
    buffer.put(clientAddress);
    buffer.putInt(content.length);
    buffer.put(content);

    return buffer;
  }

}
