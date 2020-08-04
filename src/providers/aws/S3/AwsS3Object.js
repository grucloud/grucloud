const AWS = require("aws-sdk");
const fs = require("fs").promises;
const md5File = require("md5-file");
const defaultsDeep = require("rubico/x/defaultsDeep");

const { isEmpty, first } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "S3Object" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  map,
  filter,
  pipe,
  not,
  tap,
  tryCatch,
  switchCase,
  fork,
} = require("rubico");
const { convertError, mapPoolSize } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Object = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 7 };
  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

  const s3 = new AWS.S3();

  const findName = (item) => {
    assert(item, "findName");
    return item.Key;
  };

  const findId = (item) => {
    assert(item, "findName");
    const id = item.Key;
    assert(id, "findId Id");
    return id;
  };

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
  const getList = async ({ resources = [] }) =>
    await pipe([
      tap(() => logger.debug(`listObjects #resources ${resources.length}`)),
      async (resources) =>
        await map.pool(
          mapPoolSize,
          async (resource) =>
            await pipe([
              () => getBucket(resource),
              (bucket) => ({
                Bucket: bucket.name,
                Prefix: resource.name,
                MaxKeys: 1,
              }),
              tryCatch(
                async (params) =>
                  await pipe([
                    async (params) => await s3.listObjects(params).promise(),
                    ({ Contents }) => first(Contents),
                    switchCase([
                      (content) => content,
                      (content) => ({ content }),
                      () => null,
                    ]),
                  ])(params),
                switchCase([
                  (error) => error.code === "NoSuchBucket",
                  () => null,
                  (error, params) => ({
                    error: convertError({
                      error,
                      procedure: "s3.listObjects",
                      params,
                    }),
                  }),
                ])
              ),
            ])(resource)
        )(resources),
      filter((result) => result),
      switchCase([
        pipe([filter((result) => result.error), not(isEmpty)]),
        (objects) => {
          throw { code: 500, errors: objects };
        },
        (objects) => objects,
      ]),
      (objects) => ({
        total: objects.length,
        items: map((result) => result.content)(objects),
      }),
      tap((result) => logger.debug(`listObjects result: ${tos(result)}`)),
    ])(resources);

  const getByName = async ({ name, dependencies }) =>
    await pipe([
      tap(() => logger.debug(`getByName ${name}`)),
      () => getBucket({ dependencies, name }),
      (bucket) =>
        tryCatch(
          async (bucket) =>
            pipe([
              async (bucket) =>
                await fork({
                  // listObjects
                  content: async (bucket) =>
                    await pipe([
                      (bucket) => ({
                        Bucket: bucket.name,
                        Prefix: name,
                        MaxKeys: 1,
                      }),
                      async (params) => await s3.listObjects(params).promise(),
                      ({ Contents }) => first(Contents),
                    ])(bucket),
                  // getObjectTagging
                  TagSet: async (bucket) =>
                    await pipe([
                      (bucket) => ({
                        Bucket: bucket.name,
                        Key: name,
                      }),
                      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObjectTagging-property
                      async (params) =>
                        await s3.getObjectTagging(params).promise(),
                      ({ TagSet }) => TagSet,
                    ])(bucket),
                })(bucket),
              ({ content, TagSet }) => ({ ...content, TagSet }),
            ])(bucket),
          switchCase([
            (error) => ["NoSuchBucket", "NoSuchKey"].includes(error.code),
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

    return await pipe([
      () => getBucket({ dependencies, name }),
      async (bucket) =>
        await pipe([
          fork({
            Body: async () => await fs.readFile(source),
            ContentMD5: pipe([
              async () => await md5File(source),
              (md5) => new Buffer.from(md5, "hex").toString("base64"),
            ]),
          }),
          pipe([
            tap((x) => {
              logger.debug(`Body  ContentMD5 ${tos(x)}`);
            }),
            ({ Body, ContentMD5 }) => ({
              ...otherProperties,
              Body,
              Bucket: bucket.name,
              ContentMD5,
              Tagging: `${managedByKey}=${managedByValue}&${stageTagKey}=${stage}${
                Tagging && `&${Tagging}`
              }`,
            }),
            async (params) => await s3.putObject(params).promise(),
            tap(
              async () =>
                await retryExpectOk({
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
              logger.debug(`create ${tos(result)}`);
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
    logger.debug(`configDefault ${tos({ name, properties })}`);
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
    destroy,
    getList,
    configDefault,
  };
};

exports.isOurMinionS3Object = ({ resource, resourceNames = [], config }) => {
  assert(resource);
  const { managedByKey, managedByValue } = config;
  const isMinion =
    !!resource.TagSet?.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    ) || resourceNames.includes(resource.Key);

  logger.debug(`isOurMinion s3 object: isMinion ${isMinion}`);
  return isMinion;
};
