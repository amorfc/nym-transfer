package net.nymtech.request;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;

final class RequestDeserializerTest {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void should_Deserialize_Given_ByteBuffer() throws IOException {
    // given
    var type = Request.Type.UPLOAD_FILE;
    var testContentBytes = objectMapper.writeValueAsBytes(TestData.content);
    ByteBuffer serializedRequest = ByteBuffer.allocate(TestData.bytesBeforeDelimiter.length
        + TestData.delimiter.length + 16 + 4 + 1 + TestData.clientAddress.length() + testContentBytes.length);
    serializedRequest.put(TestData.bytesBeforeDelimiter);
    serializedRequest.put(TestData.delimiter);
    serializedRequest.putLong(TestData.requestId.getMostSignificantBits());
    serializedRequest.putLong(TestData.requestId.getLeastSignificantBits());
    serializedRequest.put(type.value());
    serializedRequest.putInt(TestData.clientAddress.length());
    serializedRequest.put(TestData.clientAddress.getBytes(StandardCharsets.UTF_8));
    serializedRequest.put(testContentBytes);

    // when
    var actual = RequestDeserializer.deserialize(serializedRequest);

    // then
    assertThat(actual).usingRecursiveComparison()
        .isEqualTo(new Request(TestData.requestId, Request.Type.UPLOAD_FILE, TestData.clientAddress, testContentBytes));
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_ByteBuffer_Has_No_Delimiter()
      throws IOException {
    // given
    ByteBuffer serializedRequest = ByteBuffer.allocate(TestData.bytesBeforeDelimiter.length);
    serializedRequest.put(TestData.bytesBeforeDelimiter);

    // when
    var thrown = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(serializedRequest));

    // then
    assertThat(thrown.getMessage()).isEqualTo("Offset couldn't be extracted!");
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_ByteBuffer_Has_Less_Size_Than_Expected()
      throws IOException {
    // given
    ByteBuffer serializedRequest =
        ByteBuffer.allocate(TestData.bytesBeforeDelimiter.length + TestData.delimiter.length + 16);
    serializedRequest.put(TestData.bytesBeforeDelimiter);
    serializedRequest.put(TestData.delimiter);
    serializedRequest.putLong(TestData.requestId.getMostSignificantBits());
    serializedRequest.putLong(TestData.requestId.getLeastSignificantBits());

    // when
    var thrown = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(serializedRequest));

    // then
    assertThat(thrown.getMessage()).isEqualTo("Message has invalid format!");
  }

  @Test
  void should_Throw_IllegalArgumentException_When_Given_ByteBuffer_Has_Invalid_Value_As_Request_Type()
      throws IOException {
    // given
    var testContentBytes = objectMapper.writeValueAsBytes(TestData.content);
    ByteBuffer serializedRequest = ByteBuffer.allocate(TestData.bytesBeforeDelimiter.length
        + TestData.delimiter.length + 16 + 1 + testContentBytes.length);
    serializedRequest.put(TestData.bytesBeforeDelimiter);
    serializedRequest.put(TestData.delimiter);
    serializedRequest.putLong(TestData.requestId.getMostSignificantBits());
    serializedRequest.putLong(TestData.requestId.getLeastSignificantBits());
    serializedRequest.put((byte) 2);
    serializedRequest.put(testContentBytes);

    // when
    var thrown = assertThrows(IllegalArgumentException.class,
        () -> RequestDeserializer.deserialize(serializedRequest));

    // then
    assertThat(thrown.getMessage()).isEqualTo("Request type couldn't be extracted!");
  }

  private static class TestData {
    private static byte[] bytesBeforeDelimiter = new byte[] {115, 111, 109, 101, 116, 104, 105, 110,
        103, 32, 97, 116, 32, 116, 104, 101, 32, 98, 101, 103, 105, 110, 110, 105, 110, 103};
    private static UUID requestId = UUID.fromString("f239dd2f-e6d7-43e8-ad6e-ba19270d6182");
    private static String content =
        "{\"userId\":\"410d5c38-aaef-40bb-8003-33300097b5f2\",\"content\":[1,2,3,4,5]}";
    private static byte[] delimiter = new byte[] {13, 10, 13, 10};
    private static String clientAddress = "CFmEv5jn1yxTdpbaRQHZe5Tyyb378Kg4FvR7auyH5zyL.5w8bcf4NRGryQfFrkrw12rStDnEqCBEruo63rxzhz953@Eb15FTXQgnenwLmqdfCQNj6PmKjMszrmHhtXqKKRafMW";
  }

}
