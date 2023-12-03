const assert = require("assert");
const { pipe, tap, map, tryCatch, gt, assign, get } = require("rubico");
const { when, size, defaultsDeep } = require("rubico/x");
const Path = require("path");
const fs = require("fs").promises;
const mime = require("mime-types");

const { walkDir } = require("./walkDir");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const { S3_AWSAccessKeyId, S3_AWSSecretKey, S3_AWS_REGION } = process.env;

const createS3Client = (env) =>
  pipe([
    tap((params) => {
      assert(env);
      //assert(env.S3_AWS_REGION);
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
  ])();

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
        assign({ ContentType: () => mime.lookup(filename) || "text/plain" }),
        tap(({ Key, ContentType }) => {
          logger.debug(`uploadFileToS3 ${s3Bucket} ${Key}, ${ContentType}`);
        }),
        (input) => new PutObjectCommand(input),
        (command) => createS3Client(process.env).send(command),
      ]),
      (error) => {
        logger.error(`uploadFileToS3 ${error}`);
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
        assert(S3_AWSAccessKeyId);
        assert(S3_AWSSecretKey);
        assert(S3_AWS_REGION);
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
        logger.debug(`uploadDirToS3 done`);
      }),
    ])
  )();
