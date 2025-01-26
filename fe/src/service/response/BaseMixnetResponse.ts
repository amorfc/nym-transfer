/**
 * Mirrors your Java `Response(Status, byte[])` structure.
 * But we also include:
 *  - `requestId` (UUID v4, stored as string)
 *  - optional `rawBytes` if you want to keep the entire data for debugging.
 */
export enum MixnetResponseStatus {
  SUCCESSFUL = 1,
  UNSUCCESSFUL = 2,
}

export interface IResponseWithAsData<T> {
  asResponseData(): T;
}

export class BaseMixnetResponse {
  public readonly requestId: string;
  public status: MixnetResponseStatus;
  public readonly content: number[];
  public readonly rawBytes?: number[];

  constructor(
    requestId: string,
    status: MixnetResponseStatus,
    content: number[],
    rawBytes?: number[]
  ) {
    this.requestId = requestId;
    this.status = status;
    this.content = content;
    this.rawBytes = rawBytes;
  }

  /** Quick check for success. */
  public isSuccess(): boolean {
    return this.status === MixnetResponseStatus.SUCCESSFUL;
  }

  /** Quick check for failure. */
  public isFailure(): boolean {
    return this.status === MixnetResponseStatus.UNSUCCESSFUL;
  }

  public getContentAsText(): string {
    return new TextDecoder().decode(new Uint8Array(this.content));
  }

  /**
   * Attempt to parse `content` as JSON.
   * @throws {Error} If parsing fails or content is invalid
   */
  public getContentAsJson<T>(): T {
    try {
      const contentText = this.getContentAsText();
      if (!contentText) {
        throw new Error("Empty content received");
      }

      const parsed = JSON.parse(contentText);
      if (!parsed) {
        throw new Error("Parsed content is null or undefined");
      }

      return parsed as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse JSON content: ${error.message}`);
      }
      throw new Error("Failed to parse JSON content: Unknown error");
    }
  }

  /**
   * Parse a server response from raw bytes.
   * The format we expect is (for example):
   *   0..15 => requestId (128-bit UUID)
   *   16    => status byte (1 or 2)
   *   17..20 => content length (4 bytes, big-endian)
   *   21..(21+length-1) => content bytes
   */
  public static fromBytes(data: Uint8Array): BaseMixnetResponse {
    if (data.length < 21) {
      throw new Error("Not enough bytes to parse BaseMixnetResponse");
    }

    // Extract 16 bytes for requestId
    const requestIdBytes = data.slice(0, 16);
    const requestId = BaseMixnetResponse.uuidFromBytes(requestIdBytes);

    // Extract status
    const statusByte = data[16];
    if (
      ![
        MixnetResponseStatus.SUCCESSFUL,
        MixnetResponseStatus.UNSUCCESSFUL,
      ].includes(statusByte)
    ) {
      throw new Error(`Unknown status byte: ${statusByte}`);
    }
    const status = statusByte as MixnetResponseStatus;

    // Extract content length
    const contentLen = new DataView(
      data.buffer,
      data.byteOffset + 17,
      4
    ).getUint32(0, false); // big-endian

    // Extract content
    const contentStart = 21;
    const contentEnd = contentStart + contentLen;
    if (contentEnd > data.length) {
      throw new Error(
        `Content length exceeds total data. ContentEnd=${contentEnd}, dataLength=${data.length}`
      );
    }
    const content = Array.from(data.slice(contentStart, contentEnd));

    let response: BaseMixnetResponse;
    if (status === MixnetResponseStatus.SUCCESSFUL) {
      response = BaseMixnetResponse.success(requestId, content);
    } else {
      response = BaseMixnetResponse.failure(requestId, content);
    }
    return response;
  }

  /**
   * Helper: Convert 16 raw bytes into a UUID string (8-4-4-4-12).
   */
  private static uuidFromBytes(bytes: Uint8Array): string {
    // Convert to hex
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    // Insert dashes
    return hex.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
  }

  static success(requestId: string, content: number[]): BaseMixnetResponse {
    return new BaseMixnetResponse(
      requestId,
      MixnetResponseStatus.SUCCESSFUL,
      content
    );
  }

  static failure(requestId: string, content: number[]): BaseMixnetResponse {
    return new BaseMixnetResponse(
      requestId,
      MixnetResponseStatus.UNSUCCESSFUL,
      content
    );
  }
}
