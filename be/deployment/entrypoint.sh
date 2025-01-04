#!/bin/bash
./nym-client run --id nym_transfer &
./openlogic-openjdk-jre-21.0.5+11-linux-x64/bin/java -jar ./nym-transfer-backend-1.0-SNAPSHOT.jar
