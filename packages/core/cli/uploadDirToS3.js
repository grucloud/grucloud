const assert = require("assert");
const { pipe, tap, map, tryCatch } = require("rubico");
const { when } = require("rubico/x");
const Path = require("path");
const fs = require("fs").promises;

const { walkDir } = require("./walkDir");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const client = new S3Client({ region: AWS_REGION });
const logger = require("../logger")({ prefix: "uploadDirToS3" });

const uploadFileToS3 =
  ({ s3Bucket, s3Key, baseDir }) =>
  (filename) =>
    tryCatch(
      pipe([
        tap((params) => {
          assert(s3Bucket);
          assert(baseDir);
          assert(s3Key);
        }),
        () => Path.resolve(baseDir, filename),
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

exports.uploadDirToS3 = ({ s3Bucket, s3Key, dir = "artifacts" }) =>
  when(
    () => s3Bucket && s3Key,
    pipe([
      tap(() => {
        logger.debug(`uploadDirToS3 ${s3Bucket} ${s3Key}`);
        assert(s3Bucket);
        assert(s3Key);
        assert(dir);
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      () => "",
      walkDir({ baseDir: dir }),
      tap((files) => {
        assert(files);
        logger.debug(`uploadDirToS3 #files ${files.length}`);
      }),
      map.pool(10, uploadFileToS3({ baseDir: dir, s3Bucket, s3Key })),
      tap((params) => {
        assert(params);
      }),
    ])
  )();