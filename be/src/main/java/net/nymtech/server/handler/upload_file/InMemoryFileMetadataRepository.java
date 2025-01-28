package net.nymtech.server.handler.upload_file;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

class InMemoryFileMetadataRepository implements FileMetadataRepository {

  private final ConcurrentHashMap<String, FileMetadata> fileMetadata = new ConcurrentHashMap<>();

  @Override
  public void insert(FileMetadata fileMetadataToInsert) {
    fileMetadata.put(fileMetadataToInsert.path(), fileMetadataToInsert);
  }

  @Override
  public Optional<FileMetadata> findBy(String path) {
    return Optional.ofNullable(fileMetadata.get(path));
  }

}
