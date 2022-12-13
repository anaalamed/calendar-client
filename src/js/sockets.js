import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import { serverAddress } from "./constants";
import { update } from "./doc-functions";

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

const addUpdate = (documentID, user, content, startPosition, endPosition) => {
  console.log("---- addUpdate ----");
  sendUpdate(user, "APPEND", content, startPosition, endPosition);
};

const deleteUpdate = (user, startPosition, endPosition) => {
  console.log("---- addUpdate ----");
  sendUpdate(user, "DELETE", "", startPosition, endPosition);
};

//TODO: add documentID to sent variable
const sendUpdate = (
  documentID,
  user,
  type,
  content,
  startPosition,
  endPosition
) => {
  console.log("---- sendUpdate ----");
  stompClient.send(
    "/app/update",
    [],
    JSON.stringify({
      documentID: documentID,
      user: user,
      type: type,
      content: content,
      startPosition: startPosition,
      endPosition: endPosition,
    })
  );
};

//join
const onJoin = (documentId, userId) => {
  console.log("---- onJoin ----");

  stompClient.send(
    "/app/join",
    [],
    JSON.stringify({
      documentId: documentId,
      userId: userId,
    })
  );
};

//leave
const onLeave = () => {
  console.log("---- onLeave ----");

  stompClient.send(
    "/app/leave",
    [],
    JSON.stringify({
      documentId: documentId,
      userId: userId,
    })
  );
};

//import
const onImport = (filePath, ownerId, parentID) => {
  console.log("---- onImport ----");

  stompClient.send(
    "/app/import",
    [],
    JSON.stringify({
      filePath: filePath,
      ownerId: ownerId,
      parentID: ownerId,
      s,
    })
  );
};

//import
const onExport = (documentId) => {
  console.log("---- onExport ----");

  stompClient.send(
    "/app/export",
    [],
    JSON.stringify({
      documentId: documentId,
    })
  );
};

export { openConnection, addUpdate, deleteUpdate };
