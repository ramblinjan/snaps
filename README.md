# snaps

An app for real-time voting from audience devices for poetry slams.

## Setup

This project uses only Node.js built-in modules so no dependencies are required.

1. Start the server:

   ```bash
   node server.js
   ```

   The server listens on `http://localhost:3000` by default.

2. Open a browser and navigate to `http://localhost:3000`.

Multiple clients can connect at the same time. Votes are sent to the server and
updates are broadcast to all connected clients using Server-Sent Events.
