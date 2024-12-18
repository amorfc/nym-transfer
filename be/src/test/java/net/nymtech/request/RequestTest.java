package net.nymtech.request;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.UUID;
import org.junit.jupiter.api.Test;

final class RequestTest {

  @Test
  void should_Return_String_Representation_Of_Request() {
    // given
    var id = UUID.fromString("f239dd2f-e6d7-43e8-ad6e-ba19270d6182");
    var type = Request.Type.UPLOAD_FILE;
    var clientAddress = "1234";
    var content = new byte[] {104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33};
    var underTest = new Request(id, type, clientAddress, content);

    // when
    var actual = underTest.toString();

    // then
    assertThat(actual).isEqualTo(
        "Request [id=f239dd2f-e6d7-43e8-ad6e-ba19270d6182, type=UPLOAD_FILE, clientAddress=1234, content=[104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33]]");
  }

}
