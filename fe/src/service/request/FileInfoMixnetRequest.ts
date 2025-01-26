import {
  BaseMixnetRequest,
  MixnetRequestType,
} from "@/service/request/BaseMixnetRequest";

export interface FileInfoPayload {
  userId: string;
  path: string;
}

export class FileInfoMixnetRequest extends BaseMixnetRequest {
  constructor(
    recipientAddress: number[],
    selfAddress: number[],
    payload: FileInfoPayload
  ) {
    super(
      MixnetRequestType.GET_FILE_INFO,
      selfAddress,
      recipientAddress,
      payload
    );
  }
}
