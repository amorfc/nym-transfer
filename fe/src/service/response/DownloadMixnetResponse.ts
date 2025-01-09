import {
  MixnetResponseStatus,
  BaseMixnetResponse,
} from "@/service/response/BaseMixnetResponse";

export interface DownloadMixnetResponseData {
  content: number[];
  status: MixnetResponseStatus;
}

export class DownloadMixnetResponse extends BaseMixnetResponse {
  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    super(requestId, status, content, rawBytes);
  }

  public asResponseData(): DownloadMixnetResponseData {
    return {
      content: this.content,
      status: this.status,
    };
  }

  public static fromBaseResponse(
    baseResponse: BaseMixnetResponse
  ): DownloadMixnetResponse {
    return new DownloadMixnetResponse(
      baseResponse.requestId,
      baseResponse.status,
      baseResponse.content,
      baseResponse.rawBytes
    );
  }
}
