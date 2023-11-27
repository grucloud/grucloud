import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get, map, tryCatch, all } = rubico;
import Stream from "node:stream";

import { createS3Client, createUploadStream } from "./S3Client.js";

import createSql from "./Sql.js";
import createRunStep from "./RunStep.js";
import { connectToWebSocketServer } from "./WebSocketClient.js";

const sql = createSql();

const sqlConnect = () => sql`SELECT 1;`;

const stream = new Stream.PassThrough();

const GcRunner = ({ flow, Bucket, Key }) =>
  pipe([
    tap((params) => {
      assert(flow);
      assert(Bucket);
      assert(Key);
    }),
    all({
      sqlInit: pipe([
        sqlConnect,
        tap((params) => {
          assert(params.count);
        }),
      ]),
      uploadStream: pipe([
        createS3Client,
        (s3Client) => ({
          s3Client,
          stream,
          Bucket,
          Key,
        }),
        tap((params) => {
          assert(true);
        }),
        createUploadStream,
      ]),
      ws: pipe([
        () => ({ wsUrl: process.env.WS_URL, wsRoom: process.env.WS_ROOM }),
        connectToWebSocketServer,
      ]),
    }),
    ({ uploadStream, ws }) =>
      pipe([
        () => flow,
        get("steps"),
        tap((params) => {
          assert(uploadStream);
        }),
        tryCatch(
          pipe([
            map.series(createRunStep({ sql, stream, ws })),
            () => ({ command: "end", data: {} }),
            JSON.stringify,
            (x) => ws.send(x),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => ({ command: "end", data: { error: true } }),
              JSON.stringify,
              (x) => ws.send(x),
              () => ({ error }),
            ])()
        ),
        tap((params) => {
          assert(true);
        }),
        all({
          streamEnd: () => stream.end(),
          uploadStreamDone: () => uploadStream.done(),
          sqlClose: () => sql.close(),
          wsClose: () => ws.close(),
        }),
      ])(),
  ])();

export default GcRunner;
