const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");

const {
  map,
  pipe,
  not,
  tap,
  tryCatch,
  switchCase,
  fork,
  get,
  pick,
} = require("rubico");
const {
  append,
  defaultsDeep,
  isEmpty,
  callProp,
  includes,
  unless,
} = require("rubico/x");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const logger = require("@grucloud/core/logger")({ prefix: "S3Object" });
const { compareAws } = require("../AwsCommon");

const { retryCall } = require("@grucloud/core/Retry");
const { findNamespaceInTags } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

const { tos } = require("@grucloud/core/tos");
const { md5FileBase64, md5FileHex } = require("@grucloud/core/utils/md5");
const { convertError } = require("@grucloud/core/Common");
const { createS3 } = require("./AwsS3Common");

const tagsSerialize = pipe([
  map(({ Key, Value }) => `${Key}=${Value}`),
  callProp("join", "&"),
]);

const buildTagsS3Object = ({
  config: {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    providerName,
    stage,
    projectName,
    projectNameKey,
    namespaceKey,
  },
  Tags = [],
  namespace = "",
}) =>
  pipe([
    () =>
      `${managedByKey}=${managedByValue}&${stageTagKey}=${stage}&${createdByProviderKey}=${providerName}&${namespaceKey}=${namespace}&${projectNameKey}=${projectName}`,
    unless(() => isEmpty(Tags), append(`&${tagsSerialize(Tags)}`)),
  ])();

exports.buildTagsS3Object = buildTagsS3Object;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Object = ({ spec, config }) => {
  const s3 = createS3(config);
  const client = AwsClient({ spec, config })(s3);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const findName =
    () =>
    ({ Bucket, Key }) =>
      `${Bucket}/${Key}`;

  const findId = findName;

  const findNamespace = findNamespaceInTags;

  const getBucket = ({ name, dependencies }) => {
    assert(name);
    assert(dependencies, "missing dependencies");
    const { bucket } = dependencies();
    if (!bucket) {
      throw {
        code: 422,
        message: `s3 object '${name}' is missing the bucket dependency'`,
      };
    }
    return bucket;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList s3 #resources ${resources.length}`);
      }),
      () => resources,
      map(getByName),
    ])();

  const getByKey = ({ Key, Bucket }) =>
    pipe([
      tap(() => {
        logger.info(`getByKey ${JSON.stringify({ Key, Bucket })}`);
        assert(Key);
        assert(Bucket);
      }),
      () => ({ Key, Bucket }),
      tryCatch(
        pipe([
          fork({
            ACL: pipe([s3().getObjectAcl, pick(["Grants", "Owner"])]),
            signedUrl: tryCatch(
              pipe([
                tap((params) => {
                  assert(true);
                }),
                (input) =>
                  getSignedUrl(
                    new S3Client(config),
                    new GetObjectCommand(input),
                    {}
                  ),
                tap((params) => {
                  assert(true);
                }),
              ]),
              (error, bucket) =>
                pipe([
                  // error happens when using AWS profile
                  tap((params) => {
                    logger.error(
                      `getSignedUrl error for ${JSON.stringify(bucket)}`
                    );
                    logger.error(error);
                  }),
                  () => ({
                    error,
                  }),
                ])()
            ),
            content: pipe([s3().headObject]),
            Tags: pipe([
              //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObjectTagging-property
              s3().getObjectTagging,
              get("TagSet"),
            ]),
          }),
          ({ content, ...others }) => ({
            Bucket,
            Key,
            ...content,
            ...others,
          }),
          tap((params) => {
            assert(true);
          }),
        ]),
        (error) =>
          pipe([
            () => ["NoSuchBucket", "NoSuchKey", "NotFound"],
            switchCase([
              includes(error.name),
              () => null,
              () =>
                pipe([
                  tap(() => {
                    logger.debug(
                      `getByKey error ${Bucket}/${Key}: ${tos(error)}`
                    );
                  }),
                  () => ({
                    Bucket,
                    Key,
                    error: convertError({ error }),
                  }),
                ])(),
            ]),
          ])()
      ),
      tap((result) => {
        // logger.debug(`getByKey result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name, dependencies, properties }) =>
    pipe([
      tap(() => {
        assert(config);
        assert(dependencies);
        assert(properties);
        logger.info(`getByName ${name}`);
      }),
      fork({
        Bucket: pipe([() => getBucket({ dependencies, name }), get("name")]),
        Key: pipe([() => properties({ config }), get("Key")]),
      }),
      getByKey,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  const headObject = ({ Bucket, Key }) =>
    pipe([
      tap(() => {
        assert(Bucket, "headObject Bucket");
        assert(Key, "headObject Key");
      }),
      () => ({ Bucket, Key }),
      tryCatch(
        switchCase([s3().headObject, () => true, () => false]),
        () => false
      ),
    ])();

  const isUpById = pipe([headObject, not(isEmpty)]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  const create = ({
    name,
    namespace,
    payload: { source, ...otherProperties },
    dependencies,
    programOptions,
  }) =>
    pipe([
      tap(() => {
        logger.info(`create ${tos(name)}`);
        assert(name);
        assert(dependencies);
        assert(programOptions);
      }),
      () => getBucket({ dependencies, name }),
      (bucket) =>
        pipe([
          () => path.resolve(programOptions.workingDirectory, source),
          tap((fullPath) => {
            logger.debug(`create s3 object from file: '${fullPath}'`);
          }),
          fork({
            Body: fs.readFile,
            ContentMD5: md5FileBase64,
          }),
          pipe([
            ({ Body, ContentMD5 }) => ({
              ...otherProperties,
              Body,
              ContentMD5,
              Metadata: {
                md5hash: ContentMD5,
              },
            }),
            (params) =>
              retryCall({
                name: `s3 putObject: ${name}`,
                fn: () => s3().putObject(params),
                config,
              }),
            tap(() =>
              retryCall({
                name: `s3 isUpById: ${bucket.name}/${name}`,
                fn: () => isUpById({ Bucket: bucket.name, Key: name }),
                config: clientConfig,
              })
            ),
            tap((result) => {
              logger.info(`created object: ${tos(result)}`);
            }),
          ]),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  const destroy = client.destroy({
    pickId: pick(["Bucket", "Key"]),
    method: "deleteObject",
    ignoreErrorCodes: ["NoSuchBucket"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { bucket },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(bucket, `missing bucket dependency on S3Object '${name}'`);
        assert(
          otherProps.source,
          `missing source attribute on S3Object '${name}'`
        );
      }),
      () => otherProps,
      defaultsDeep({
        Bucket: get("config.Bucket")(bucket),
        Tagging: buildTagsS3Object({ config, namespace, Tags }),
      }),
    ])();

  return {
    spec,
    config: clientConfig,
    findNamespace,
    findId,
    getByName,
    findName,
    create,
    update: create,
    destroy,
    getList,
    configDefault,
  };
};

exports.compareS3Object = pipe([
  tap((params) => {
    assert(true);
  }),
  compareAws({ getTargetTags: () => [], getLiveTags: () => [] })({
    filterTarget: ({ programOptions }) =>
      pipe([
        tap(() => {
          assert(programOptions);
        }),
        (target) =>
          pipe([
            tap(() => {
              assert(programOptions.workingDirectory);
              assert(target.source, "missing source");
            }),
            () => path.resolve(programOptions.workingDirectory, target.source),
            md5FileHex,
            tap((targetHex) => {
              assert(targetHex);
            }),
          ])(),
        (ETag) => ({
          ETag,
        }),
      ]),
    filterLive: () =>
      pipe([
        get("ETag"),
        callProp("replaceAll", '"', ""),
        (ETag) => ({ ETag }),
      ]),
  }),
  tap((params) => {
    assert(true);
  }),
]);
