package net.nymtech.server.utils;

/**
 * Represents the API that encrypts a given {@code String} and decrypts back.
 */
public interface EncryptionHelper {

  /**
   * Encrypts the given {@code plainText}.
   * 
   * @param plainText plain text to be encrypted
   * @return encrypted text.
   */
  String encrypt(String plainText);

  /**
   * Decrypts the given {@code encryptedText}.
   * 
   * @param encryptedText encrypted text to be decrypted
   * @return plain text decrypted.
   */
  String decrypt(String encryptedText);

}
