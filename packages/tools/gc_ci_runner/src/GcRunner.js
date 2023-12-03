import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get, map, tryCatch, all } = rubico;
import Stream from "node:stream";

import { createS3Client, createUploadStream } from "./S3Client.js";

//import createSql from "./Sql.js";
import createRunStep from "./RunStep.js";
import { connectToWebSocketServer } from "./WebSocketClient.js";

//const sql = createSql();

//const sqlConnect = () => sql`SELECT 1;`;

const stream = new Stream.PassThrough();

const GcRunner = ({
  GC_FLOW,
  S3_BUCKET,
  S3_BUCKET_KEY,
  WS_URL,
  WS_ROOM,
  S3_AWS_REGION,
  S3_AWSAccessKeyId,
  S3_AWSSecretKey,
}) =>
  pipe([
    tap((params) => {
      assert(GC_FLOW);
      assert(S3_BUCKET);
      assert(S3_BUCKET_KEY);
      assert(WS_URL);
      assert(WS_ROOM);
    }),
    all({
      // sqlInit: pipe([
      //   sqlConnect,
      //   tap((params) => {
      //     assert(params.count);
      //   }),
      // ]),
      uploadStream: pipe([
        createS3Client({ S3_AWS_REGION, S3_AWSAccessKeyId, S3_AWSSecretKey }),
        (s3Client) => ({
          s3Client,
          stream,
          S3_BUCKET,
          S3_BUCKET_KEY,
        }),
        tap((params) => {
          assert(true);
        }),
        createUploadStream,
      ]),
      ws: pipe([
        () => ({ wsUrl: WS_URL, wsRoom: WS_ROOM }),
        connectToWebSocketServer,
      ]),
    }),
    tap((params) => {
      console.log("connected");
    }),
    ({ uploadStream, ws }) =>
      pipe([
        () => GC_FLOW,
        get("steps"),
        tap((params) => {
          assert(uploadStream);
        }),
        tryCatch(
          pipe([
            map.series(createRunStep({ stream, ws })),
            () => ({ command: "end", data: {} }),
            JSON.stringify,
            (x) => ws.send(x),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
                console.error("GcRunner error", error);
                console.error("message", error.message);
                console.error("stack", error.stack);
              }),
              () => ({
                command: "end",
                data: {
                  error: { message: error.message },
                  errorRaw: error.toString(),
                },
              }),
              JSON.stringify,
              (x) => ws.send(x),
              () => ({ error: error.toString() }),
            ])()
        ),
        tap((params) => {
          assert(true);
        }),
        all({
          streamEnd: () => stream.end(),
          uploadStreamDone: () => uploadStream.done(),
          //sqlClose: () => sql.close(),
          wsClose: () => ws.close(),
        }),
      ])(),
  ])();

export default GcRunner;
