import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import { serverAddress } from "./constants";

let stompClient;
const socketFactory = () => {
  return new SockJS(serverAddress + "/ws");
};

const onMessageReceived = (payload) => {
  console.log("---- onMessageReceived ----");
  var message = JSON.parse(payload.body);
  console.log("---- onMessageReceived2 before update ----");

  console.log(message);
  update(message);
};

const onConnected = () => {
  console.log("---- onConnected ----");
  stompClient.subscribe("/topic/updates", onMessageReceived);
  stompClient.send("/app/hello", [], JSON.stringify({ name: "Default user" }));
};

const openConnection = () => {
  console.log("---- openConnection ----");
  const socket = socketFactory();
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnected);
};

export { openConnection };
