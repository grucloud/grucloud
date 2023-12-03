import assert from "assert";
import { S3Client } from "@aws-sdk/client-s3";
import Stream from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import rubico from "rubico";
const { pipe, tap } = rubico;
import defaultsDeep from "rubico/x/defaultsDeep.js";
import when from "rubico/x/when.js";

export const createS3Client = (env) =>
  pipe([
    tap((params) => {
      assert(env.S3_AWS_REGION);
    }),
    () => ({ region: env.S3_AWS_REGION }),
    when(
      () => env.S3_AWSAccessKeyId,
      defaultsDeep({
        credentials: {
          accessKeyId: env.S3_AWSAccessKeyId,
          secretAccessKey: env.S3_AWSSecretKey,
        },
      })
    ),
    (params) => new S3Client(params),
  ]);

export async function createUploadStream({
  s3Client,
  stream,
  S3_BUCKET_KEY,
  S3_BUCKET,
}) {
  assert(s3Client);
  assert(S3_BUCKET_KEY);
  assert(S3_BUCKET);

  const passThroughStream = new Stream.PassThrough();

  try {
    const uploadStream = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET,
        Key: S3_BUCKET_KEY,
        Body: passThroughStream,
        ContentType: "text/plain",
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });
    stream.pipe(passThroughStream);
    uploadStream.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });
    return uploadStream;
  } catch (e) {
    console.log(e);
    throw error;
  }
}
