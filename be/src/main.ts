//#region Client
// import { createNymMixnetClient } from '@nymproject/sdk';

// const main = async () => {
//   console.log("Hello World!");

//   const nym = await createNymMixnetClient();
//   console.log("Client created!");

//   const nymApiUrl = 'https://validator.nymtech.net/api';

//   // show message payload content when received
//   nym.events.subscribeToTextMessageReceivedEvent((e) => {
//     console.log("Message received: ", e.args.payload);
//   });
//   console.log("Subscribed!");

//   // start the client and connect to a gateway
//   await nym.client.start({
//     clientId: "My unbelieveble client!",
//     nymApiUrl: nymApiUrl
//   });
//   console.log("Client started!");

//   // send a message to yourself
//   const payload = {
//     message: "Hello mixnet"
//   };
//   const recipient = await nym.client.selfAddress();
//   nym.client.send({ 
//     payload: payload, 
//     recipient: recipient!!
//   });
//   console.log("Message sent!");
// };

// Connect to a websocket. 
//#endregion

import WebSocket, { Data } from 'ws';

function connectWebsocket(url: string): Promise<WebSocket> {
  return new Promise(function (resolve, reject) {
    var server = new WebSocket(url);
    server.onopen = function () {
      resolve(server);
    };
    server.onerror = function (err) {
      reject(err);
    };
  });
}

function convertToJSON(data: Data): any {
  let jsonString: string;

  if (typeof data === 'string') {
    jsonString = data;
  } else if (Buffer.isBuffer(data)) {
    jsonString = data.toString('utf-8');
  } else if (data instanceof ArrayBuffer) {
    const decoder = new TextDecoder('utf-8');
    jsonString = decoder.decode(data);
  } else if (Array.isArray(data) && data.every(item => Buffer.isBuffer(item))) {
    jsonString = Buffer.concat(data).toString('utf-8');
  } else {
    throw new Error('Unsupported data type');
  }

  try {
    console.log({jsonString})
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

const main = async () => {
  console.log("Hello world!")
  var port = '1977' // client websocket listens on 1977 by default, change if yours is different
  var localClientUrl = "ws://127.0.0.1:" + port;

  try {
    let websocket: WebSocket = await connectWebsocket(localClientUrl)
    websocket.onmessage = (event: WebSocket.MessageEvent) => {
      try {
        console.log("Data " + event.data)
        let response = JSON.parse(event.data as string);

        if(response.type == "received") {
          const text = response.message
          const replySurb = response.replySurb
          console.log("Text: " + text)
          console.log("Reply Surb: " + replySurb)

          const message = {
            type: "reply",
            message: "Okay, I got you bro!",
            replySurb: replySurb,
          }
          websocket.send(JSON.stringify(message));
        } else {
          console.log("Unkown event!")
        }
      } catch(e) {
        console.error("Something went wrong: " + e)
      }
    }
  } catch(e) {
    console.error("Something went wrong: " + e)
  }
}

main();
