const assert = require("assert");
const { pipe, tap, map, tryCatch, gt } = require("rubico");
const { when, size } = require("rubico/x");
const Path = require("path");
const fs = require("fs").promises;

const { walkDir } = require("./walkDir");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const client = new S3Client({ region: AWS_REGION });
const logger = require("../logger")({ prefix: "uploadDirToS3" });

const uploadFileToS3 =
  ({ s3Bucket, s3Key, s3LocalDir }) =>
  (filename) =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(s3Bucket);
          assert(s3LocalDir);
          assert(s3Key);
        }),
        () => Path.resolve(s3LocalDir, filename),
        (path) => fs.readFile(path),
        (Body) => ({
          Body,
          Bucket: s3Bucket,
          Key: Path.join(s3Key, filename),
        }),
        tap((params) => {
          assert(true);
        }),
        (input) => new PutObjectCommand(input),
        (command) => client.send(command),
      ]),
      (error) => {
        console.log(error);
        return { error };
      }
    )();

exports.uploadDirToS3 = ({ s3Bucket, s3Key, s3LocalDir = "artifacts" }) =>
  when(
    () => s3Bucket && s3Key,
    pipe([
      tap(() => {
        logger.debug(`uploadDirToS3 ${s3Bucket} ${s3Key}, from ${s3LocalDir}`);
        assert(s3Bucket);
        assert(s3Key);
        assert(s3LocalDir);
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      () => "",
      walkDir({ baseDir: s3LocalDir }),
      tap((files) => {
        assert(files);
        logger.debug(`uploadDirToS3 #files ${files.length}`);
      }),
      tap.if(gt(size, 10), () => {
        throw Error("Trying to upload too many files");
      }),
      map.pool(10, uploadFileToS3({ s3LocalDir, s3Bucket, s3Key })),
      tap((params) => {
        assert(params);
      }),
    ])
  )();
