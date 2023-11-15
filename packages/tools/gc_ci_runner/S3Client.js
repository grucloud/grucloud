import assert from "assert";
import { S3Client } from "@aws-sdk/client-s3";
import Stream from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";

export const createS3Client = () => {
  assert(process.env.S3_AWSAccessKeyId);
  assert(process.env.S3_AWSSecretKey);
  assert(process.env.S3_AWS_REGION);

  return new S3Client({
    credentials: {
      accessKeyId: process.env.S3_AWSAccessKeyId,
      secretAccessKey: process.env.S3_AWSSecretKey,
    },
    region: process.env.S3_AWS_REGION,
  });
};

export async function createUploadStream({ s3Client, stream, Key, Bucket }) {
  const passThroughStream = new Stream.PassThrough();

  try {
    const uploadStream = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: passThroughStream,
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
