export enum MixnetRequestType {
  TYPE_A = 1,
  TYPE_B = 2,
}

export class MixnetRequest {
  constructor(
    public requestId: string,
    public type: MixnetRequestType,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public payload: Record<string, any>
  ) {}
}
