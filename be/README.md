# nym-transfer Backend

Backend application that serves to the requests come through NYM Mixnet.

## Prerequisites

- Docker

## Running the Application

1. Build the Docker image inside of the [deployment](./deployment/) folder
```bash
docker build --platform linux/amd64 -t nym-transfer-backend .
```
2. Run a container from the image you built
```bash
docker run --platform linux/amd64 nym-transfer-backend
```

In the logs that are printed out by the container, you'll see the client address like below:

_The address of this client is: 8VxjRxQL31JfNT6FFuwYoJkXoeYcLqsBwXG5Y2zt2Jxo.4GLZWsdgLKCBdYo2vhfXwXduiGgsBJ4HquxVWx8Ut331@983r9LKDT9UUxx4Zsn2AH49poJ7Ep24ueR8ENfWFgCX6_

You can use that client address to send requests to the backend application through NYM Mixnet.

## APIs

### Upload File API

This API provides the user to upload files to their own space. In order to call this API, a client should make a [_send_ request](https://nymtech.net/docs/developers/clients/websocket/usage#sending-binary-data) to NYM Client. The payload of the send request should include the data below:

#### Request

- **Request ID**: A UUID contained in the first 16 bytes of the payload. <ins>Note that</ins> this ID is the one that is placed inside of the response payload in order to let the client to associate the response with the request that they sent beforehand.
- **Request type**: A byte that indicates that the request is an upload file request. It should be `1` for upload file requests.
- **Length of client address**: Four bytes that indicates the length of client address following.
- **Client address**: Client NYM Mixnet address. The size of this address should match with the integer given as 'Length of client address'.
- **Length of request content**: Four bytes that indicates the length of request content following.
- **Request content**: JSON formatted data that is particular to the upload file API. [See for the format](/be/src/main/java/net/nymtech/server/handler/upload_file/UploadFileRequest.java). An example content can be as below:
  ```json
  {
    "userId": "27aefbf2-9afa-4c24-a60d-564fbf8d0916",
    "title": "title",
    "content": [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  ```

So the payload should be _at least 16(request ID) + 1(request type) + 4(length of client address) + 4(length of request content) = <ins>25 bytes</ins>_.

#### Response

The payload of the response that the client consumes from NYM Mixnet will be as below:
- **Request ID**: This is the ID that is sent by the client beforehand. [See](/be/README.md?plain=1#L32).
- **Response status**: A byte that indicates whether the request processed successfully or not. `1` if it succeeded, `2` if it failed.
- **Length of response content**: Four bytes that indicates the length of response content following.
- **Response content**: This field is up to the response status.
  - **If the request failed**, i.e. _response status = 2_: A UTF-8 encoded string that gives the detail about the failure.
  - **If the request succeeded**, i.e. _response status = 1_: JSON formatted data that is particular to the upload file API. [See for the format](/be/src/main/java/net/nymtech/server/handler/upload_file/UploadFileResponse.java). An example content:
    ```json
    {
      "path": "/27aefbf2-9afa-4c24-a60d-564fbf8d0916/title"
    }
    ```
    The path in the content can be used to dowload the file uploaded.

You can take a look into [the contact test](/be/src/test/java/net/nymtech/server/ServerContractTest.java#L59) that uploads a file for more detail.

### Download File API

This API provides the user to dowloand files from their own space. In order to call this API, a client should make a [_send_ request](https://nymtech.net/docs/developers/clients/websocket/usage#sending-binary-data) to NYM Client. The payload of the send request should be the same as upload file request except the request content:

#### Request

- **Request content**: JSON formatted data that is particular to the download file API. [See for the format](/be/src/main/java/net/nymtech/server/handler/download_file/DownloadFileRequest.java). An example content:
  ```json
  {
    "userId": "27aefbf2-9afa-4c24-a60d-564fbf8d0916",
    "path": "/27aefbf2-9afa-4c24-a60d-564fbf8d0916/title"
  }
  ```

So the payload should be again _at least 16(request ID) + 1(request type) + 4(length of client address) + 4(length of request content) = <ins>25 bytes</ins>_.

#### Response

The payload of the response that the client consumes from NYM Mixnet will be the same as upload file response except the response content:
- **Response content**: This field is up to the response status.
  - **If the request failed**, i.e. _response status = 2_: A UTF-8 encoded string that gives the detail about the failure.
  - **If the request succeeded**, i.e. _response status = 1_: File bytes.
