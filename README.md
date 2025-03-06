# Nym Transfer: Setup and Usage

This guide explains how to set up and run the Nym client, the backend application, and the frontend application, including an optional benchmark feature for measuring file upload/download performance.

---

## 1. Nym Client Setup

1. **Download the Nym Binary**  
   - Obtain the Nym binary from the [Nym releases page](https://github.com/nymtech/nym/releases) (or the official source).

2. **Initialize the Nym Client**  
   - Follow the [Nym WebSocket Client documentation](https://nymtech.net/developers/clients/websocket-client.html) to initialize the client correctly:
     ```sh
     ./nym-client init --id your-client-id
     ```

3. **Run the Nym Client**  
   - Start the Nym client on your local machine:
     ```sh
     ./nym-client run --id your-client-id
     ```

---

## 2. Backend Application

1. **Refer to the Backend Documentation**  
   - Please see the [backend repo documentation](https://github.com/amorfc/nym-transfer/tree/stable/be) for instructions on building and running the backend.  
   - Once you have the backend running, it will log an address you can use for `VITE_NYM_BACKEND_CLIENT_ADDRESS_BYTES` (explained in the next section).

---

## 3. Frontend Application

1. **Set Up Environment Variables**  
   - Navigate to the `fe` folder and copy `.env.example` to a file named `.env`.  
   - In your new `.env` file, set:
     - **`VITE_NYM_ENTRY_CLIENT_WS_URL`**: The WebSocket URL for your local Nym client (e.g., `ws://localhost:1977`).  
     - **`VITE_NYM_BACKEND_CLIENT_ADDRESS_BYTES`**: The byte array address of your Nym client connected to the backend (this is typically logged when the backend starts).

2. **Install Dependencies and Start the App**  
   - From the `fe` folder:
     ```bash
     yarn && yarn run dev
     ```
   - Keep your browser console open to see status messages or errors.

3. **Confirm Connectivity**  
   - Load the frontend in your browser. It will attempt to connect to your local Nym client using the environment variables. Check the browser console for any errors or success messages.

---

## 4. Benchmark Testing (Development Mode Only)

**Example**


https://github.com/user-attachments/assets/ab66d38f-bbe1-4c23-970d-b8dd1c68a3b6


A benchmark feature is included to measure file upload and download performance. This feature is **only available** when running in development mode.

1. **Run the Frontend in Dev Mode**  
   - Make sure you have followed the steps above (Nym client, backend, and frontend in dev mode).

2. **Access the Benchmark Page**  
   - In your browser, go to `[base-url]/benchmark` (e.g., `http://localhost:3000/benchmark`).
   - You should see a dedicated page or modal to:
     - **Upload a file** (test upload speed and duration).  
     - **Get file info** (test how quickly the app retrieves file metadata).  
     - **Download a file** (test download speed and duration).

3. **Review the Results**  
   - The modal or page will display performance metrics. These are for internal testing and may not reflect real-world production performance.

**Note:** The benchmark route does **not** appear in production builds—it is only active in dev or staging environments.

---

## 5. Example Commands Reference

Below are commonly used commands to get everything running:

### Nym Client
```sh
./nym-client init --id your-client-id
./nym-client run --id your-client-id
