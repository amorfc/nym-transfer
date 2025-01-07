import { BaseMixnetRequest } from "@/service/request/BaseMixnetRequest";

export interface IRequestManager {
  request: BaseMixnetRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
  timeoutId: NodeJS.Timeout;
}

export class RequestManager {
  readonly requests: Map<string, IRequestManager>;

  constructor() {
    this.requests = new Map<string, IRequestManager>();
  }

  public createRequest(
    requestId: string,
    request: BaseMixnetRequest,
    timeoutMs: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Create a timeout that will reject the promise if no response arrives
      const timeoutId = setTimeout(() => {
        // Remove the request from the pool
        this.requests.delete(requestId);
        reject(
          new Error(`Request ${requestId} timed out after ${timeoutMs} ms.`)
        );
      }, timeoutMs);

      // Store the request details in the map
      this.requests.set(requestId, {
        request,
        resolve,
        reject,
        timeoutId,
      });
    });
  }

  public finalizeRequest(
    requestId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    successPayload?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorPayload?: any
  ) {
    const pendingRequest = this.requests.get(requestId);
    if (!pendingRequest) {
      // No matching request found; possibly an unknown or expired request
      return;
    }

    // Clear the timeout to prevent memory leaks
    clearTimeout(pendingRequest.timeoutId);
    // Remove from the map
    this.requests.delete(requestId);

    // Resolve or reject the original promise
    if (errorPayload) {
      pendingRequest.reject(errorPayload);
    } else {
      pendingRequest.resolve(successPayload);
    }
  }
}
