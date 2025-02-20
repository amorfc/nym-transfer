package net.nymtech.server.handler.common;

import java.util.Optional;

public interface FileMetadataRepository {

  void insert(FileMetadata fileMetadataToInsert);

  Optional<FileMetadata> findBy(String path);

}
