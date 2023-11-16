import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get, map, tryCatch, all } = rubico;
import Stream from "node:stream";

import { createS3Client, createUploadStream } from "./S3Client.js";

import createSql from "./Sql.js";
import createRunStep from "./RunStep.js";

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
    }),
    ({ uploadStream }) =>
      pipe([
        () => flow,
        get("steps"),
        tap((params) => {
          assert(uploadStream);
        }),
        tryCatch(
          //
          map.series(createRunStep({ sql, stream })),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => ({ error }),
            ])()
        ),
        tap((params) => {
          assert(true);
        }),
        () => stream.end(),
        () => uploadStream.done(),
        sql.close,
      ])(),
  ])();

export default GcRunner;
