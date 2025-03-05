# My Project

![Project Diagram](assets/structure.png)

## Overview

> [!Warning]
> Please be aware since current implementation doesn't support concurrent requests please don't use multiple browser tabs at the same time to avoid new connection to being open.

This project demonstrates how to use the Nym client to create a secure and private communication channel. The Nym client is initialized using the Nym binary from the releases, and a Nym client is set up following the instructions provided in the [Nym WebSocket Client documentation](https://nymtech.net/developers/clients/websocket-client.html).

## Running the Application

To run this application, follow these steps:

1. **Download the Nym Binary**: Download the Nym binary from the releases page.
2. **Initialize the Nym Client**: Follow the instructions in the [Nym WebSocket Client documentation](https://nymtech.net/developers/clients/websocket-client.html) to initialize the Nym client.
3. **Run the Nym Client**: Start the Nym client on your local machine.

```sh
./nym-client init --id your-client-id
./nym-client run --id your-client-id
```

4. **Run the Backend Server**:

   - Please use this [doc for be](https://github.com/amorfc/nym-transfer/tree/stable/be)

## 5. Run the Frontend Application

1. **Set Up Environment Variables**  
   - Copy the `.env.example` file in the `fe` folder and rename it to `.env`.  
   - In your new `.env` file, you will see entries for:
     - **`VITE_NYM_ENTRY_CLIENT_WS_URL`** – This should point to the local Nym client’s WebSocket URL (e.g., `ws://localhost:1977` if that’s where your client is running).  
     - **`VITE_NYM_BACKEND_CLIENT_ADDRESS_BYTES`** – This must be set to the byte array address of your Nym client that’s connected to the backend, allowing your local client to communicate. (This will be fixed this is just a workaround)

2. **Install Dependencies and Start the App**  
   - Open a terminal, navigate to the `fe` folder, and run:
     ```bash
     yarn && yarn run dev
     ```
   - After the development server starts, **keep your browser console open** to monitor logs or potential errors.

3. **Confirm Connectivity**  
   - Once you load the frontend in your browser, it will attempt to connect to your local Nym client using the environment variables. Check the console for any connection errors or success messages.

---

## Example Commands

### Starting the Nym Client

```sh
./nym-client init --id your-client-id
./nym-client run --id your-client-id
```
```bash
yarn && yarn run dev
```
