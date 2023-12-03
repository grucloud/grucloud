import assert from "assert";
import { describe, it } from "node:test";
import Stream from "node:stream";
import rubico from "rubico";
const { pipe, tap, tryCatch } = rubico;
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createS3Client, createUploadStream } from "../src/S3Client.js";

describe("S3", () => {
  const S3_BUCKET = process.env.S3_BUCKET;
  assert(S3_BUCKET);

  let stream = new Stream.PassThrough();

  it("list s3 bucket", () =>
    pipe([
      () => ({}),
      createS3Client(process.env),
      (s3Client) =>
        pipe([
          () =>
            new ListObjectsV2Command({
              Bucket: S3_BUCKET,
              MaxKeys: 1,
            }),
          (cmd) => s3Client.send(cmd),
          tap((params) => {
            assert(true);
          }),
        ])(),
    ])());

  it("stream to s3 bucket", () =>
    tryCatch(
      pipe([
        () => ({}),
        createS3Client(process.env),
        (s3Client) =>
          pipe([
            () => ({
              s3Client,
              stream,
              S3_BUCKET,
              S3_BUCKET_KEY: "test/stream-to-S3-test.txt",
            }),
            createUploadStream,
            (uploadStream) =>
              pipe([
                tap((params) => {
                  assert(true);
                  stream.write("toto");
                  stream.end("toto");
                }),
                () => uploadStream.done(),
              ])(),
            tap((params) => {
              assert(true);
            }),
          ])(),
      ]),
      (error) => {
        throw error;
      }
    )());
});
