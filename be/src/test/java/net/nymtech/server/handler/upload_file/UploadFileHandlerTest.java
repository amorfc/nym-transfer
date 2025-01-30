package net.nymtech.server.handler.upload_file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import java.io.IOException;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import net.nymtech.server.response.Response;

@ExtendWith(MockitoExtension.class)
final class UploadFileHandlerTest {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Mock
  private FileUploader uploader;
  @Mock
  private EncryptionHelper encryptionHelper;
  @Mock
  private FileMetadataRepository repository;

  private UploadFileHandler underTest;

  @BeforeEach
  void setUp() {
    underTest =
        new UploadFileHandler(objectMapper, "/base-path", uploader, encryptionHelper, repository);
  }

  @Test
  void should_Handle_Upload_File_Request() throws IOException {
    // given
    doNothing().when(uploader).upload(anyString(), any());
    when(encryptionHelper.encrypt(anyString())).thenReturn("encrypted-path");
    doNothing().when(repository).insert(any());

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    var expectedResponseContent = new UploadFileResponse("encrypted-path");
    assertThat(actual)
        .isEqualTo(Response.success(objectMapper.writeValueAsBytes(expectedResponseContent)));

    verify(uploader, times(1)).upload("/base-path/" + expectedResponseContent.path(),
        TestData.content);

    verify(encryptionHelper).encrypt("test-title");

    var argumentCaptorFileMetadata = ArgumentCaptor.forClass(FileMetadata.class);
    verify(repository, times(1)).insert(argumentCaptorFileMetadata.capture());
    var insertedMetadata = argumentCaptorFileMetadata.getValue();
    assertThat(insertedMetadata.id()).isNotNull();
    assertThat(insertedMetadata.userId()).isEqualTo(TestData.userId);
    assertThat(insertedMetadata.title()).isEqualTo(TestData.title);
    assertThat(insertedMetadata.message()).isEqualTo(TestData.message);
    assertThat(insertedMetadata.path()).isEqualTo("encrypted-path");
    assertThat(insertedMetadata.uploadTimestamp())
        .isGreaterThan(System.currentTimeMillis() - 5_000);
  }

  @ParameterizedTest
  @MethodSource("argumentsForInvalidRequestContent")
  void should_Fail_When_Given_Request_Content_Is_Invalid(byte[] requestContent) throws IOException {
    // given

    // when
    var actual = underTest.handle(TestData.requestId, requestContent);

    // then
    assertThat(actual).isEqualTo(Response.unexpectedFailure());
    verifyNoInteractions(uploader, encryptionHelper, repository);
  }

  @Test
  void should_Fail_When_File_Uploading_Failed() throws IOException {
    // given
    when(encryptionHelper.encrypt(anyString())).thenReturn("encrypted-path");
    doThrow(new IOException()).when(uploader).upload("/base-path/encrypted-path",
        "Hello World!".getBytes());

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    assertThat(actual).isEqualTo(Response.unexpectedFailure());
    verifyNoInteractions(repository);
  }

  private static Stream<Arguments> argumentsForInvalidRequestContent() throws IOException {
    var validRequestContent = (ObjectNode) objectMapper.readTree(TestData.requestContent);
    return Stream.of(
        Arguments
            .of(objectMapper.writeValueAsBytes(validRequestContent.deepCopy().remove("userId"))),
        Arguments
            .of(objectMapper.writeValueAsBytes(validRequestContent.deepCopy().remove("title"))),
        Arguments
            .of(objectMapper.writeValueAsBytes(validRequestContent.deepCopy().remove("content"))),
        Arguments.of(objectMapper.writeValueAsBytes(objectMapper.createObjectNode())));
  }

  private static class TestData {

    private static final UUID requestId = UUID.fromString("4b1363d1-241b-4e7a-9c0c-adb46d4507c2");
    private static final UUID userId = UUID.fromString("27aefbf2-9afa-4c24-a60d-564fbf8d0916");
    private static final String title = "test-title";
    private static final String message = "The file I wanted to share with you!";
    private static final byte[] content = "Hello World!".getBytes();
    private static byte[] requestContent;
    static {
      try {
        requestContent =
            objectMapper.writeValueAsBytes(new UploadFileRequest(userId, title, message, content));
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }

  }

}
