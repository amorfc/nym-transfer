import {
  MixnetResponseStatus,
  BaseMixnetResponse,
} from "@/service/response/BaseMixnetResponse";

export interface UploadMixnetResponseData {
  path: string;
  status: MixnetResponseStatus;
}

export class UploadMixnetResponse extends BaseMixnetResponse {
  public path?: string;

  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    super(requestId, status, content, rawBytes);
    // If we want to parse `content` as JSON for the `path` field:
    if (this.isSuccess()) {
      const jsonData = this.getContentAsJson();
      if (jsonData && typeof jsonData.path === "string") {
        this.path = jsonData.path;
      }
    }
  }

  public asResponseData(): UploadMixnetResponseData {
    return {
      path: this.path ?? "",
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
