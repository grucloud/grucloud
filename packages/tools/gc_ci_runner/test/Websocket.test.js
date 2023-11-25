import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;
import { describe, it } from "node:test";

import { connectToWebSocketServer } from "../WebSocketClient.js";

const promisifyWsClient = (ws) =>
  new Promise((resolve, reject) => {
    ws.on("close", () => {
      console.log("close");
      ws.close();
      resolve();
    });
    ws.on("error", (error) => {
      console.log(error);
      reject();
    });
  });

describe("Websocket", () => {
  it("connectToWebSocketServer", () =>
    pipe([
      tap(() => {
        assert(process.env.WS_ROOM);
        assert(process.env.WS_URL);
      }),
      () => ({ wsUrl: process.env.WS_URL, wsRoom: process.env.WS_ROOM }),
      connectToWebSocketServer,
      (ws) =>
        pipe([
          tap(async () => {
            assert(ws);
            ws.send(
              JSON.stringify({
                origin: "docker",
                command: "logs",
                data: "my logs",
              })
            );
            ws.close();
            await promisifyWsClient(ws);
          }),
        ])(),
    ])());
});
