export enum MixnetRequestType {
  UPLOAD_FILE = 1,
}

export class MixnetRequest {
  constructor(
    public requestId: string,
    public type: MixnetRequestType,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public payload: Record<string, any>
  ) {}
}
