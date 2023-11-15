import assert from "assert";
import Stream from "node:stream";
import rubico from "rubico";
const { pipe, tap, get } = rubico;
import { createS3Client, createUploadStream } from "./S3Client.js";

import { runCommand } from "./RunCommand.js";

let stream = new Stream.PassThrough();

const RunStep =
  ({ sql, ws, Bucket }) =>
  (step) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(step);
      }),
      createS3Client,
      (s3Client) => ({
        s3Client,
        stream,
        Bucket,
        Key: "test/stream-to-S3-test",
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
          uploadStream.done,
        ])(),
    ])();

export default RunStep;
