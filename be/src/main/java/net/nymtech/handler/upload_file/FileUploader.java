package net.nymtech.handler.upload_file;

import java.io.IOException;

@FunctionalInterface
interface FileUploader {

  void upload(String pathStr, byte[] content) throws IOException;

}
