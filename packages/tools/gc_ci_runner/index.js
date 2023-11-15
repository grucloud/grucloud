import assert from "assert";
import rubico from "rubico";
const { pipe, tap, tryCatch } = rubico;

import GcRunner from "./GcRunner.js";

assert(process.env.S3_BUCKET);
assert(process.env.S3_BUCKET_KEY);
assert(process.env.S3_AWSAccessKeyId);
assert(process.env.S3_AWSSecretKey);
assert(process.env.S3_AWS_REGION);

assert(process.env.GC_FLOW);

tryCatch(
  pipe([
    () => process.env.GC_FLOW,
    JSON.parse,
    (flow) => ({
      flow,
      Bucket: process.env.S3_BUCKET,
      Key: process.env.S3_BUCKET_KEY,
    }),
    GcRunner,
    tap((result) => {
      assert(true);
    }),
  ]),
  (error) => {
    console.error(error);
    process.exit(1);
  }
)();
