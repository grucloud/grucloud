const assert = require("assert");
const fs = require("fs").promises;

const {
  map,
  filter,
  pipe,
  not,
  tap,
  tryCatch,
  switchCase,
  fork,
  get,
} = require("rubico");
const { defaultsDeep, isEmpty, first, find } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "S3Object" });
const { retryCall } = require("@grucloud/core/Retry");
const {
  S3New,
  shouldRetryOnException,
  findNamespaceInTags,
} = require("../AwsCommon");

const { tos } = require("@grucloud/core/tos");
const {
  convertError,
  mapPoolSize,
  md5FileBase64,
} = require("@grucloud/core/Common");

const buildTags = ({
  config: {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    providerName,
    stage,
    projectName,
    namespaceKey,
  },
  Tagging,
  namespace = "",
}) =>
  `${managedByKey}=${managedByValue}&${stageTagKey}=${stage}&${createdByProviderKey}=${providerName}&${namespaceKey}=${namespace}&projectName=${projectName}${
    Tagging ? `&${Tagging}` : ""
  }`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Object = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const s3 = S3New(config);

  const findName = get("Key");
  const findId = findName;

  const findNamespace = findNamespaceInTags(config);

  const findDependencies = ({ live }) => [
    {
      type: "S3Bucket",
      ids: pipe([
        () => live,
        get("Bucket"),
        (bucket) => [bucket],
        tap((xxx) => {
          assert(true);
        }),
      ])(),
    },
  ];

  const getBucket = ({ name, dependencies = {} }) => {
    assert(name);
    const { bucket } = dependencies;
    if (!bucket) {
      throw {
        code: 422,
        message: `s3 object '${name}' is missing the bucket dependency'`,
      };
    }
    return bucket;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = async ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList s3 #resources ${resources.length}`);
      }),
      map.pool(mapPoolSize, getByName),
      filter(not(isEmpty)),
      //TODO may not be needed
      switchCase([
        pipe([filter(get("error")), not(isEmpty)]),
        (objects) => {
          throw { code: 500, errors: objects };
        },
        (objects) => objects,
      ]),
      (items) => ({
        total: items.length,
        items,
      }),
      tap((result) => {
        logger.info(`getList s3 total: ${tos(result.total)}`);
      }),
    ])(resources);

  const getByName = async ({ name, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => getBucket({ dependencies, name }),
      (bucket) => ({
        Bucket: bucket.name,
        Key: name,
      }),
      (params) =>
        tryCatch(
          pipe([
            fork({
              list: pipe([
                ({ Bucket }) =>
                  s3().listObjectsV2({
                    Bucket,
                    Prefix: name,
                    MaxKeys: 1,
                  }),
                get("Contents"),
                first,
              ]),
              content: pipe([(params) => s3().headObject(params)]),
              Tags: pipe([
                //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObjectTagging-property
                (params) => s3().getObjectTagging(params),
                get("TagSet"),
              ]),
            }),
            ({ list, content, Tags }) => ({
              Bucket: params.Bucket,
              ...list,
              ...content,
              Tags,
            }),
          ]),
          switchCase([
            (error) =>
              ["NoSuchBucket", "NoSuchKey", "NotFound"].includes(error.code),
            () => null,
            (error, bucket) =>
              pipe([
                tap(() => {
                  logger.debug(
                    `getByName error ${bucket.name}/${name}: ${tos(error)}`
                  );
                }),
                () => ({
                  bucket,
                  error: convertError({
                    error,
                    params: {
                      Bucket: bucket.name,
                      Key: name,
                    },
                  }),
                }),
              ])(),
          ])
        )(params),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  const headObject = async ({ Bucket, Key }) => {
    assert(Bucket, "headObject Bucket");
    assert(Key, "headObject Key");
    try {
      await s3().headObject({ Bucket, Key });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      logger.error(`headObject`);
      logger.error(error);

      throw error;
    }
  };

  const getById = ({ id }) => getByName({ name: id });

  const isUpById = async ({ Bucket, Key }) => {
    assert(Bucket, "isUpById Bucket");
    assert(Key, "isUpById Key");
    const up = await headObject({ Bucket, Key });
    logger.info(`isUpById ${Bucket}/${Key} ${up ? "UP" : "DOWN"}`);
    return up;
  };

  const isDownById = async ({ id, resource }) => {
    assert(id, "isDownById id");
    assert(resource, `isDownById: no resource for id ${id}`);
    const bucket = getBucket(resource);
    const up = await headObject({ Bucket: bucket.name, Key: id });
    logger.info(`isDownById ${bucket.name}/${id} ${up ? "UP" : "DOWN"}`);
    return !up;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  const create = async ({ name, namespace, payload, dependencies }) => {
    assert(name);
    assert(payload);
    assert(dependencies);

    const { Tagging, source, ...otherProperties } = payload;

    if (!source) {
      throw {
        code: 422,
        message: `missing source attribute on S3Object '${name}'`,
      };
    }

    logger.info(`create ${tos(name)}`);

    return pipe([
      () => getBucket({ dependencies, name }),
      (bucket) =>
        pipe([
          fork({
            Body: () => fs.readFile(source),
            ContentMD5: () => md5FileBase64(source),
          }),
          pipe([
            tap((x) => {
              //logger.debug(`Body  ContentMD5 ${tos(x)}`);
            }),
            ({ Body, ContentMD5 }) => ({
              ...otherProperties,
              Body,
              Bucket: bucket.name,
              ContentMD5,
              Tagging: buildTags({ config, namespace, Tagging }),
              Metadata: {
                md5hash: ContentMD5,
              },
            }),
            (params) =>
              retryCall({
                name: `s3 putObject: ${name}`,
                fn: () => s3().putObject(params),
                shouldRetryOnException,
                config,
              }),
            tap(() =>
              retryCall({
                name: `s3 isUpById: ${bucket.name}/${name}`,
                fn: () => isUpById({ Bucket: bucket.name, Key: name }),
                config: clientConfig,
              })
            ),
            ({ ETag, ServerSideEncryption }) => ({
              ETag,
              ServerSideEncryption,
            }),
            tap((result) => {
              logger.info(`created object: ${tos(result)}`);
            }),
          ]),
        ])(),
    ])();
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  const destroy = async ({ id, resource }) =>
    pipe([
      tap(() => {
        logger.info(`destroy object ${id}`);
      }),
      getBucket,
      (bucket) => ({
        Bucket: bucket.name,
        Key: id,
      }),
      (params) => s3().deleteObject(params),
      tap(() => {
        logger.info(`destroyed object ${id}`);
      }),
    ])(resource);

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({ Key: name })(properties);

  return {
    type: "S3Object",
    spec,
    config: clientConfig,
    findNamespace,
    findId,
    findDependencies,
    getByName,
    findName,
    create,
    update: create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};

exports.compareS3Object = async ({ target, live }) => {
  logger.debug(`compare object`);
  assert(live.Metadata);
  const { md5hash } = live.Metadata;
  assert(md5hash);
  if (target.source) {
    const md5 = await md5FileBase64(target.source);

    if (md5hash !== md5) {
      logger.debug(`object are different`);
      return {
        liveDiff: { updated: { md5: md5hash } },
        targetDiff: { updated: { md5: md5 } },
      };
    }
  }

  return {};
};
