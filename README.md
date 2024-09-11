# My Project

![Project Diagram](assets/structure.png)

## Overview

This project demonstrates how to use the Nym client to create a secure and private communication channel. The Nym client is initialized using the Nym binary from the releases, and a Nym client is set up following the instructions provided in the [Nym WebSocket Client documentation](https://nymtech.net/developers/clients/websocket-client.html).

## Running the Application

To run this application, follow these steps:

1. **Download the Nym Binary**: Download the Nym binary from the releases page.
2. **Initialize the Nym Client**: Follow the instructions in the [Nym WebSocket Client documentation](https://nymtech.net/developers/clients/websocket-client.html) to initialize the Nym client.
3. **Run the Nym Client**: Start the Nym client on your local machine.
4. **Run the Backend Server**: Run another program (Java or Node.js) that listens to the Nym client URL and port. Whenever any frontend client wants to access the backend server, they can do so through the Nym client address.

## Disclaimer

**Please do not use the Java instance yet as it is not ready. Use the `jsbe` file for now.**

## Example Commands

### Starting the Nym Client

```sh
./nym-client init --id your-client-id
./nym-client run --id your-client-id
```
