# nym-transfer Backend

Backend application that serves to the requests come through NYM Mixnet.

## Prerequisites

- NYM Client that runs at port `1977`
- Maven 3.8.5 or newer
- JDK 21


## Running the Application

1. Build the JAR
```bash
mvn clean package
```
2. Run the application
```bash
java -jar target/nym-transfer-1.0-SNAPSHOT-jar-with-dependencies.jar
```