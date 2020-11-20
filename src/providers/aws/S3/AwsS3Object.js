const assert = require("assert");
const AWS = require("aws-sdk");
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
const { defaultsDeep, isEmpty, first } = require("rubico/x");
const logger = require("../../../logger")({ prefix: "S3Object" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { convertError, mapPoolSize, md5FileBase64 } = require("../../Common");

const buildTags = ({
  config: {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    providerName,
    stage,
  },
  Tagging,
}) =>
  `${managedByKey}=${managedByValue}&${stageTagKey}=${stage}&${createdByProviderKey}=${providerName}${
    Tagging ? `&${Tagging}` : ""
  }`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Object = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const s3 = new AWS.S3();

  const findName = get("Key");

  const findId = findName;

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
        logger.debug(`getList #resources ${resources.length}`);
      }),
      (resources) =>
        map.pool(mapPoolSize, (resource) =>
          pipe([
            () => getBucket(resource),
            (bucket) => ({
              Bucket: bucket.name,
              Prefix: resource.name,
              MaxKeys: 1,
            }),
            tryCatch(
              (params) =>
                pipe([
                  (params) => s3.listObjectsV2(params).promise(),
                  get("Contents"),
                  first,
                  switchCase([
                    (content) => content,
                    get("content"),
                    () => null,
                  ]),
                ])(params),
              switchCase([
                (error) => error.code === "NoSuchBucket",
                () => null,
                (error, params) => ({
                  error: convertError({
                    error,
                    procedure: "s3.listObjectsV2",
                    params,
                  }),
                }),
              ])
            ),
          ])(resource)
        )(resources),
      filter((result) => result),
      switchCase([
        pipe([filter(get("error")), not(isEmpty)]),
        (objects) => {
          throw { code: 500, errors: objects };
        },
        (objects) => objects,
      ]),
      (objects) => ({
        total: objects.length,
        items: map((result) => result.content)(objects),
      }),
      tap((result) => {
        logger.debug(`listObjects result: ${tos(result)}`);
      }),
    ])(resources);

  const getByName = async ({ name, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => getBucket({ dependencies, name }),
      (bucket) =>
        tryCatch(
          async (bucket) =>
            pipe([
              fork({
                //TODO get param before
                // headObject
                content: pipe([
                  (bucket) => ({
                    Bucket: bucket.name,
                    Key: name,
                  }),
                  (params) => s3.headObject(params).promise(),
                ]),
                // getObjectTagging
                Tags: pipe([
                  (bucket) => ({
                    Bucket: bucket.name,
                    Key: name,
                  }),
                  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObjectTagging-property
                  (params) => s3.getObjectTagging(params).promise(),
                  get("TagSet"),
                ]),
              }),
              ({ content, Tags }) => ({ ...content, Tags }),
            ])(bucket),
          switchCase([
            (error) =>
              ["NoSuchBucket", "NoSuchKey", "NotFound"].includes(error.code),
            () => null,
            (error, bucket) => {
              throw convertError({
                error,
                params: {
                  Bucket: bucket.name,
                  Key: name,
                },
              });
            },
          ])
        )(bucket),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  const headObject = async ({ Bucket, Key }) => {
    assert(Bucket, "headObject Bucket");
    assert(Key, "headObject Key");
    try {
      await s3.headObject({ Bucket, Key }).promise();
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

  const getById = async ({ id }) => await getByName({ name: id });

  const isUpById = async ({ Bucket, Key }) => {
    assert(Bucket, "isUpById Bucket");
    assert(Key, "isUpById Key");
    const up = await headObject({ Bucket, Key });
    logger.debug(`isUpById ${Bucket}/${Key} ${up ? "UP" : "DOWN"}`);
    return up;
  };

  const isDownById = async ({ id, resourcesPerType }) => {
    assert(id, "isDownById id");
    const resource = resourcesPerType.find((resource) => resource.name === id);
    assert(resource, `isDownById: no resource for id ${id}`);
    const bucket = getBucket(resource);
    const up = await headObject({ Bucket: bucket.name, Key: id });
    logger.debug(`isDownById ${bucket.name}/${id} ${up ? "UP" : "DOWN"}`);
    return !up;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  const create = async ({ name, payload, dependencies }) => {
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
              Tagging: buildTags({ config, Tagging }),
              Metadata: {
                md5hash: ContentMD5,
              },
            }),
            (params) => s3.putObject(params).promise(),
            tap(() =>
              retryExpectOk({
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
  const destroy = async ({ id, resourcesPerType }) => {
    logger.debug(`destroy object ${tos({ id, resourcesPerType })}`);
    assert(id, `destroy invalid object id`);
    const resource = resourcesPerType.find((resource) => resource.name === id);
    assert(resource, `no resource for id ${id}`);
    const bucket = getBucket(resource);
    var params = {
      Bucket: bucket.name,
      Key: id,
    };

    await s3.deleteObject(params).promise();
  };

  const configDefault = async ({ name, properties }) => {
    return defaultsDeep({ Key: name })(properties);
  };

  return {
    type: "S3Object",
    spec,
    config: clientConfig,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    update: create,
    destroy,
    getList,
    configDefault,
  };
};

exports.isOurMinionS3Object = ({ resource, resourceNames = [], config }) => {
  assert(resource);
  const { managedByKey, managedByValue } = config;
  const isMinion =
    !!resource.Tags?.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    ) || resourceNames.includes(resource.Key);

  logger.debug(`isOurMinion s3 object: isMinion ${isMinion}`);
  return isMinion;
};

exports.compareS3Object = async ({ target, live }) => {
  logger.debug(`compare object`);
  const md5hash = live.Metadata?.md5hash;
  if (!md5hash) {
    logger.debug(`no md5 hash for ${tos(live)}`);
    return [];
  }
  if (target.source) {
    const md5 = await md5FileBase64(target.source);

    if (md5hash !== md5) {
      logger.debug(`object are different`);
      return [{ type: "DIFF", target, live }];
    }
  }

  return [];
};
