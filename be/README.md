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