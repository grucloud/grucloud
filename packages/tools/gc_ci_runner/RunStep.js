import assert from "assert";
import Stream from "node:stream";
import rubico from "rubico";
//import Path from "path";

const { pipe, tap, get } = rubico;
import { createS3Client, createUploadStream } from "./S3Client.js";

import { runCommand } from "./RunCommand.js";

const stream = new Stream.PassThrough();

const RunStep =
  ({ sql, ws, Bucket, Key }) =>
  (step) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(step);
        assert(Key);
      }),
      createS3Client,
      (s3Client) => ({
        s3Client,
        stream,
        Bucket,
        Key: Key,
      }),
      createUploadStream,
      (uploadStream) =>
        pipe([
          () => step,
          get("run"),
          runCommand({
            sql,
            ws,
            workingDirectory: step.workingDirectory,
            stream,
          }),
          tap((result) => {
            assert(true);
          }),
          () => uploadStream.done(),
        ])(),
    ])();

export default RunStep;
