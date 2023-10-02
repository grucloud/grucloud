const assert = require("assert");
const { pipe, tryCatch, tap, switchCase } = require("rubico");
const WebSocket = require("ws");

const logger = require("../logger")({ prefix: "websocket" });

const websockerMock = { close: () => {}, send: (message) => {} };

exports.connectToWebSocketServer = ({ wsUrl, wsRoom }) =>
  pipe([
    tap((params) => {
      logger.debug("connectToWebSocketServer", wsUrl, "wsRoom", wsRoom);
    }),
    switchCase([
      () => wsUrl && wsRoom,
      pipe([
        () => new WebSocket(wsUrl),
        tryCatch(
          (ws) =>
            new Promise((resolve, reject) => {
              ws.on("open", () => {
                logger.debug("ws open");
                ws.send(
                  JSON.stringify({
                    command: "join",
                    options: { room: wsRoom },
                  })
                );
                resolve(ws);
              });
              ws.on("close", () => {
                logger.debug("ws closed");
                ws.close();
                reject();
              });
              ws.on("error", (error) => {
                logger.error(error);
                reject(error);
              });
            }),
          (error) => websockerMock
        ),
      ]),
      () => websockerMock,
    ]),
  ])();
