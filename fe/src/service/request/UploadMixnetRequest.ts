import {
  BaseMixnetRequest,
  MixnetRequestType,
} from "@/service/request/BaseMixnetRequest";

export interface UploadPayload {
  userId: string;
  title: string;
  message: string;
  content: number[]; // Assuming content is an array of bytes
}

export class UploadMixnetRequest extends BaseMixnetRequest {
  constructor(
    recipientAddress: number[],
    selfAddress: number[],
    payload: UploadPayload
  ) {
    super(
      MixnetRequestType.UPLOAD_FILE,
      selfAddress,
      recipientAddress,
      payload
    );
  } // You can add additional methods specific to upload requests here
}
