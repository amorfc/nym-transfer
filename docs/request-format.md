# Request format

We use `rawSend` to send messages through Nym Mixnet. Therefore, we do have a predefined request format in binary form that we use as the payload in `rawSend`. This document is explaning that format.

- Deserialized Java class of the binary data:
```java
public record Request(UUID id, Request.Type type, String clientAddress, byte[] content) {
    public enum Type {
      UPLOAD_FILE((byte) 1);
    }
}
```

## Starting delimeter

Before we jump into the details of the fields we have, we should underline that we start deserializing the `Request` from a <u>starting delimeter</u>. The starting delimeter is, in decimal format, `[13 10 13 10]`. So, whatever data is sent from Nym Mixnet, we only care about the part after this delimeter. As an example, let say the data coming from Nym Mixnet is `[1, 13, 43, 12, 65, 13, 10, 13, 10, 4, 7, 23, 54, ...]`. The data which is meaningful for us is the part that is `[4, 7, 23, 54, ...]`.

Starting delimeter: `[13 10 13 10]`

## `Request`

We have two static sized fields and two variable sized fields.

### Static sized fields

- `id`: Represents the identifier of the request and it is used for debugging purposes. It's a version 4 UUID so it's **16 bytes**. In a nutshell, the first 16 bytes of the request should be this UUID.
- `type`: Represents the type of the request sent. It's just **1 byte** and currently there is only one value available which is **1** that represents that the request is the file uploading request. It should be placed at the seventeenth position.

### Variable sized fields

- `clientAddress`: Represents the UTF-8 encoded Nym Mixnet address of the client. This value is used by Backend application to send the response to the client. The size of this value can be different for different clients so the first 4 bytes are reserved for the size information. In short, the bytes **18, 19, 20, 21** should be used to place an integer value and the following bytes, i.e., the bytes **22, 23, 24, ...** should be the client address. As an example, if the client address is *CFmEv5jn1yxTdpbaRQHZe5Tyyb378Kg4FvR7auyH5zyL.5w8bcf4NRGryQfFrkrw12rStDnEqCBEruo63rxzhz953@Eb15FTXQgnenwLmqdfCQNj6PmKjMszrmHhtXqKKRafMW*, 134 character long, you should put 134 into the next 4 bytes and the client address into the following 134 bytes. In total, 138 bytes should have been placed for the example client address.

- `content`: Represents the UTF-8 encoded content of request. Value of this field changes by the request type and it should be in JSON. As an example, for the file uploading request, the content is UTF-8 encoded bytes of the value below:

```json
{
  "userId": "aaf20510-8b4e-488a-a430-d4c86b0882b4",
  "title": "file-title",
  "content": [1, 2, 3, 4, 5, 6, 7]
}
```

Backend application's `RequestDeserializer` can be examined for better understanding.