package net.nymtech.server.handler.upload_file;

import java.util.Optional;

interface FileMetadataRepository {

  void insert(FileMetadata fileMetadataToInsert);

  Optional<FileMetadata> findBy(String path);

}
