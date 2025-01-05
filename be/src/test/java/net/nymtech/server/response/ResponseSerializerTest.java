package net.nymtech.server.response;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.UUID;
import org.junit.jupiter.api.Test;

final class ResponseSerializerTest {

  @Test
  void should_Serialize_Given_Data_In_Nym_Mixnet_Format() {
    // given
    byte[] clientAddress = new byte[] {1, 2, 3, 4};
    UUID id = UUID.fromString("e0d467a6-ec5c-46a8-ae6d-de5f77574d9b");
    Response.Status status = Response.Status.SUCCESSFUL;
    byte[] content = new byte[] {5, 6, 7, 8, 9};

    // when
    var actual = ResponseSerializer.serialize(clientAddress, id, status, content);

    // then
    assertThat(actual.array()).isEqualTo(new byte[] {0, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 26, -32, -44, 103, -90, -20, 92, 70, -88, -82, 109, -34, 95, 119, 87, 77, -101,
        1, 0, 0, 0, 5, 5, 6, 7, 8, 9});
  }

}
