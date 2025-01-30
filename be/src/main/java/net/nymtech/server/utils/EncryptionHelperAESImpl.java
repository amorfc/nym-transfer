package net.nymtech.server.utils;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Log4j2
public final class EncryptionHelperAESImpl implements EncryptionHelper {

  private final Cipher encryptionCipher;
  private final Cipher decryptionCipher;

  public static EncryptionHelperAESImpl of(String secretKey) {
    try {
      var decodedSecretKey = Base64.getDecoder().decode(secretKey);
      var secretKeySpec = new SecretKeySpec(decodedSecretKey, 0, decodedSecretKey.length, "AES");

      var encryptionCipher = Cipher.getInstance("AES");
      encryptionCipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

      var decryptionCipher = Cipher.getInstance("AES");
      decryptionCipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

      return new EncryptionHelperAESImpl(encryptionCipher, decryptionCipher);
    } catch (Exception e) {
      log.error("Unexpected exceptiong during EncryptionHelperAESImpl.of!", e);
      throw new RuntimeException("Unexpected exceptiong during EncryptionHelperAESImpl.of!", e);
    }
  }

  @Override
  public String encrypt(String plainText) {
    try {
      return Base64.getEncoder().encodeToString(encryptionCipher.doFinal(plainText.getBytes()));
    } catch (Exception e) {
      log.error("Unexpected exceptiong during EncryptionHelperAESImpl.encrypt!", e);
      throw new RuntimeException("Unexpected exceptiong during EncryptionHelperAESImpl.encrypt!",
          e);
    }
  }

  @Override
  public String decrypt(String encryptedText) {
    try {
      return new String(decryptionCipher.doFinal(Base64.getDecoder().decode(encryptedText)));
    } catch (Exception e) {
      log.error("Unexpected exceptiong during EncryptionHelperAESImpl.decrypt!", e);
      throw new RuntimeException("Unexpected exceptiong during EncryptionHelperAESImpl.decrypt!",
          e);
    }
  }

}
