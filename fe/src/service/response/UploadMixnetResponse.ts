import {
  MixnetResponseStatus,
  BaseMixnetResponse,
} from "@/service/response/BaseMixnetResponse";

export interface UploadMixnetResponseData {
  path: string;
  status: MixnetResponseStatus;
}

export class UploadMixnetResponse extends BaseMixnetResponse {
  private uploadInfo?: { path: string };

  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    super(requestId, status, content, rawBytes);
    try {
      this.uploadInfo = this.getContentAsJson<{ path: string }>();
    } catch (error) {
      console.error("Error parsing upload info:", error);
      // Set status to unsuccessful since we couldn't parse the response
      this.status = MixnetResponseStatus.UNSUCCESSFUL;
    }
  }

  public asResponseData(): UploadMixnetResponseData {
    return {
      path: this.uploadInfo?.path ?? "",
      status: this.status,
    };
  }

  public static fromBaseResponse(
    baseResponse: BaseMixnetResponse
  ): UploadMixnetResponse {
    return new UploadMixnetResponse(
      baseResponse.requestId,
      baseResponse.status,
      baseResponse.content,
      baseResponse.rawBytes
    );
  }
}
