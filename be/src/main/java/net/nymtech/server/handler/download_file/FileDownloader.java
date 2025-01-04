package net.nymtech.server.handler.download_file;

import java.io.IOException;

@FunctionalInterface
interface FileDownloader {

  byte[] download(String pathStr) throws IOException;

}
