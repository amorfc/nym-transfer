package net.nymtech.server.handler.upload_file;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

final class EncryptionHelperAESImplTest {

  private static final EncryptionHelperAESImpl underTest;
  static {
    try {
      underTest = EncryptionHelperAESImpl.of("+s+LetifkMZGxGXscVqfh7P+4PKCitnr+DJvjVE4d3Y=");
    } catch (Exception e) {
      throw new RuntimeException("EncryptionHelperAESImpl couldn't be built!", e);
    }
  }

  @Nested
  class Encrypt {

    @Test
    void should_Encrypt_Given_Plain_Text() {
      // given
      String plainText = "to_be_encrypted";

      // when
      var actual = underTest.encrypt(plainText);

      // then
      assertThat(actual).isEqualTo("HmbH2dbVM9c2nG0ZqhD20A==");
    }

  }

  @Nested
  class Decrypt {

    @Test
    void should_Decrypt_Given_Encrypted_Text() {
      // given
      String encryptedText = "HmbH2dbVM9c2nG0ZqhD20A==";

      // when
      var actual = underTest.decrypt(encryptedText);

      // then
      assertThat(actual).isEqualTo("to_be_encrypted");
    }

  }

}
