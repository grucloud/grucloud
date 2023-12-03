import assert from "assert";
import WebSocket from "ws";
import rubico from "rubico";
const { pipe, tap, switchCase, tryCatch } = rubico;

const websockerMock = { close: () => {}, send: (message) => {} };

export const connectToWebSocketServer = ({ wsUrl, wsRoom }) =>
  pipe([
    tap((params) => {
      console.log("connectToWebSocketServer", wsUrl, "wsRoom", wsRoom);
    }),
    switchCase([
      () => wsUrl && wsRoom,
      pipe([
        () => new WebSocket(wsUrl),
        tryCatch(
          (ws) =>
            new Promise((resolve, reject) => {
              ws.on("open", () => {
                console.log("ws open");
                ws.send(
                  JSON.stringify({
                    origin: "grucloud-container",
                    command: "join",
                    options: { room: wsRoom },
                  })
                );
                resolve(ws);
              });
              ws.on("close", () => {
                console.log("ws closed");
                ws.close();
                reject();
              });
              ws.on("error", (error) => {
                console.error("ws error", error);
                reject(error);
              });
            }),
          (error) => websockerMock
        ),
      ]),
      () => websockerMock,
    ]),
  ])();
