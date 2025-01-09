/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseMixnetRequest } from "@/service/request/BaseMixnetRequest";

export interface PendingRequest {
  request: BaseMixnetRequest;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

export class RequestManager {
  private pendingRequests: Map<string, PendingRequest>;

  constructor() {
    this.pendingRequests = new Map();
  }

  /**
   * Creates a new pending request and returns a Promise that you can await.
   * If no response arrives within `timeoutMs`, the promise rejects.
   */
  public createRequest(
    requestId: string,
    request: BaseMixnetRequest,
    timeoutMs: number
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // Overwrite if a request with the same ID already exists
      if (this.pendingRequests.has(requestId)) {
        console.warn(`Overwriting an existing request with ID: ${requestId}`);
        this.pendingRequests.delete(requestId);
      }

      // Set up a timeout to auto-reject if no response
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(
          new Error(`Request ${requestId} timed out after ${timeoutMs} ms.`)
        );
      }, timeoutMs);

      const pending: PendingRequest = {
        request,
        resolve,
        reject,
        timeoutId,
      };

      // Store in the map
      this.pendingRequests.set(requestId, pending);
    });
  }

  /**
   * Resolves a pending request (success scenario).
   * @param requestId - The ID of the request you are resolving.
   * @param successPayload - The data to pass to the original `resolve`.
   */
  public resolveRequest(requestId: string, successPayload?: any): void {
    const pending = this.pendingRequests.get(requestId);
    if (!pending) {
      console.warn(`No pending request found to resolve (ID: ${requestId}).`);
      return;
    }

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(requestId);

    // Fulfill the original promise
    pending.resolve(successPayload);
  }

  /**
   * Rejects a pending request (failure scenario).
   * @param requestId - The ID of the request you are rejecting.
   * @param errorPayload - The error or reason to pass to the original `reject`.
   */
  public rejectRequest(requestId: string, errorPayload: any): void {
    const pending = this.pendingRequests.get(requestId);
    if (!pending) {
      console.warn(`No pending request found to reject (ID: ${requestId}).`);
      return;
    }

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(requestId);

    // Reject the original promise
    pending.reject(errorPayload);
  }

  /**
   * Clear all pending requests, rejecting each one with a generic error.
   */
  public clearAllRequests(
    reason = "RequestManager cleared all pending requests."
  ) {
    for (const [requestId, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error(`${reason} (Request ID: ${requestId})`));
    }
    this.pendingRequests.clear();
  }
}
