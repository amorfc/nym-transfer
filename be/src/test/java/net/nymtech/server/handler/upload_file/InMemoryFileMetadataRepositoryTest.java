package net.nymtech.server.handler.upload_file;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.UUID;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class InMemoryFileMetadataRepositoryTest {

  private static final InMemoryFileMetadataRepository underTest =
      new InMemoryFileMetadataRepository();

  @Nested
  class Insert {

    @Test
    void should_Insert_Into_Underlying_InMemory_Data_Structure() {
      // given

      // when
      underTest.insert(TestData.fileMetadataToInsert);

      // then
      var inserted = underTest.findBy(TestData.fileMetadataToInsert.path());
      assertThat(inserted.get()).isEqualTo(TestData.fileMetadataToInsert);
    }

  }

  @Nested
  class FindByPath {

    @Test
    void should_Return_By_Path_From_Underlying_InMemory_Data_Structure() {
      // given
      underTest.insert(TestData.fileMetadataToInsert);

      // when
      var actual = underTest.findBy(TestData.fileMetadataToInsert.path());

      // then
      assertThat(actual.get()).isEqualTo(TestData.fileMetadataToInsert);
    }

    @Test
    void should_Return_Empty_When_No_FileMetada_Exists_In_Underlying_InMemory_Data_Structure_By_Given_Path() {
      // given

      // when
      var actual = underTest.findBy(TestData.fileMetadataToInsert.path());

      // then
      assertThat(actual.isEmpty()).isEqualTo(true);
    }

  }

  static class TestData {
    private static final FileMetadata fileMetadataToInsert =
        new FileMetadata(UUID.randomUUID(), UUID.randomUUID(), "test-title",
            "The file I wanted to share with you!", "/base-path/test-title", 1738099856L);
  }

}
