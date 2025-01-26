import {
  MixnetResponseStatus,
  BaseMixnetResponse,
} from "@/service/response/BaseMixnetResponse";

export interface DownloadMixnetResponseData {
  content: number[];
  status: MixnetResponseStatus;
}

export class DownloadMixnetResponse extends BaseMixnetResponse {
  private downloadContent?: number[];

  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    super(requestId, status, content, rawBytes);
    try {
      this.downloadContent = this.content;
    } catch (error) {
      console.error("Error parsing download content:", error);
      // Set status to unsuccessful since we couldn't parse the response
      this.status = MixnetResponseStatus.UNSUCCESSFUL;
    }
  }

  public asResponseData(): DownloadMixnetResponseData {
    return {
      content: this.downloadContent ?? [],
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
