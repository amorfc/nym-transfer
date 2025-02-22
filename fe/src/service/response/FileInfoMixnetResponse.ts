import {
  MixnetResponseStatus,
  BaseMixnetResponse,
} from "@/service/response/BaseMixnetResponse";

export interface FileInfoResponseData {
  title: string;
  message: string;
  sizeInKilobytes: number;
  size_human: string;
  uploadTimestamp: string;
  status: MixnetResponseStatus;
}

type FileInfoContent = Omit<FileInfoResponseData, "status">;

export class FileInfoMixnetResponse extends BaseMixnetResponse {
  private fileInfo?: Omit<FileInfoResponseData, "status">;

  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    super(requestId, status, content, rawBytes);
    try {
      this.fileInfo = this.getContentAsJson<FileInfoContent>();
    } catch (error) {
      console.error("Error parsing file info:", error);
      // Set status to unsuccessful since we couldn't parse the response
      this.status = MixnetResponseStatus.UNSUCCESSFUL;
    }
  }

  public asResponseData(): FileInfoResponseData {
    console.log(this.fileInfo);

    return {
      title: this.fileInfo?.title ?? "",
      message: this.fileInfo?.message ?? "",
      sizeInKilobytes: this.fileInfo?.sizeInKilobytes ?? 0,
      size_human: this.fileInfo?.size_human ?? "0B",
      uploadTimestamp: this.fileInfo?.uploadTimestamp ?? "",
      status: this.status,
    };
  }

  public static fromBaseResponse(
    baseResponse: BaseMixnetResponse
  ): FileInfoMixnetResponse {
    return new FileInfoMixnetResponse(
      baseResponse.requestId,
      baseResponse.status,
      baseResponse.content,
      baseResponse.rawBytes
    );
  }
}
