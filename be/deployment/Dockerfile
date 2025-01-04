FROM debian:bullseye-slim

WORKDIR /home

COPY ./nym-transfer-backend-1.0-SNAPSHOT.jar .

COPY ./entrypoint.sh entrypoint.sh

RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    # clean up cached package lists
    rm -rf /var/lib/apt/lists/*

RUN wget -q https://github.com/nymtech/nym/releases/download/nym-binaries-v2024.14-crunch/nym-client && \
    chmod +x nym-client

RUN wget -q https://builds.openlogic.com/downloadJDK/openlogic-openjdk-jre/21.0.5+11/openlogic-openjdk-jre-21.0.5+11-linux-x64.tar.gz && \
    tar -xf openlogic-openjdk-jre-21.0.5+11-linux-x64.tar.gz

RUN ./nym-client init --id nym_transfer

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

# docker build --platform linux/amd64 -t nym-transfer-backend .
# docker run --platform linux/amd64 nym-transfer-backend