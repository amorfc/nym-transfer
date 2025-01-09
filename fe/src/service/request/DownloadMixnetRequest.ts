import {
  BaseMixnetRequest,
  MixnetRequestType,
} from "@/service/request/BaseMixnetRequest";

export interface DownloadPayload {
  userId: string;
  path: string;
}

export class DownloadMixnetRequest extends BaseMixnetRequest {
  constructor(
    recipientAddress: number[],
    selfAddress: number[],
    payload: DownloadPayload
  ) {
    super(
      MixnetRequestType.DOWNLOAD_FILE,
      selfAddress,
      recipientAddress,
      payload
    );
  }
}
