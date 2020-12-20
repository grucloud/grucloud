process.env.AWS_SDK_LOAD_CONFIG = "true";
const AWS = require("aws-sdk");
const assert = require("assert");
const { pipe, tryCatch, tap, switchCase, and, get, eq } = require("rubico");
const { first, find } = require("rubico/x");
const logger = require("../../logger")({ prefix: "AwsCommon" });
const { tos } = require("../../tos");
const { retryCall } = require("../Retry");

const KeyName = "Name";
exports.KeyName = KeyName;

const handler = ({ endpointName, endpoint }) => ({
  get: (target, name, receiver) => {
    return (...args) =>
      retryCall({
        name: `${endpointName}.${name} ${JSON.stringify(args)}`,
        fn: () => endpoint[name](...args).promise(),
        isExpectedResult: () => true,
        shouldRetryOnException: ({ error, name }) =>
          pipe([
            tap((error) => {
              logger.error(`${name}: ${tos(error)}`);
            }),
            //TODO add network error
            eq(get("code"), "Throttling"),
          ])(error),
      });
  },
});

const createEndpoint = ({ endpointName }) =>
  pipe([
    tap((config) => AWS.config.update(config)),
    (config) => new AWS[endpointName]({ region: config.region }),
    (endpoint) => new Proxy({}, handler({ endpointName, endpoint })),
  ]);

exports.Ec2New = (config) => () =>
  createEndpoint({ endpointName: "EC2" })(config);

exports.IAMNew = (config) => () =>
  createEndpoint({ endpointName: "IAM" })(config);

exports.S3New = (config) => () =>
  createEndpoint({ endpointName: "S3" })(config);

exports.Route53New = (config) => () =>
  createEndpoint({ endpointName: "Route53" })(config);

exports.CloudFrontNew = (config) => () =>
  createEndpoint({ endpointName: "CloudFront" })(config);

exports.Route53DomainsNew = () => () =>
  createEndpoint({ endpointName: "Route53Domains" })({ region: "us-east-1" });

exports.ACMNew = () => () =>
  createEndpoint({ endpointName: "ACM" })({ region: "us-east-1" });

exports.shouldRetryOnException = ({ error, name }) => {
  logger.error(`aws shouldRetryOnException ${tos({ name, error })}`);
  error.stack && logger.error(error.stack);

  return ![400, 404].includes(error.statusCode);
};

exports.shouldRetryOnExceptionDelete = ({ error, name }) => {
  logger.debug(`shouldRetryOnException ${tos({ name, error })}`);
  const retry = error.code === "DeleteConflict";
  logger.debug(`shouldRetryOnException retry: ${retry}`);
  return retry;
};

exports.buildTags = ({
  name,
  config: {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    stage,
    providerName,
  },
}) => {
  assert(name);
  assert(providerName);
  assert(stage);
  return [
    {
      Key: KeyName,
      Value: name,
    },
    {
      Key: managedByKey,
      Value: managedByValue,
    },
    {
      Key: createdByProviderKey,
      Value: providerName,
    },
    {
      Key: stageTagKey,
      Value: stage,
    },
  ];
};

exports.isOurMinion = ({ resource, config }) => {
  const { createdByProviderKey, providerName, stageTagKey, stage } = config;
  return pipe([
    tap(() => {
      assert(providerName);
      assert(createdByProviderKey);
      assert(resource);
      assert(stage);
    }),
    switchCase([
      and([
        find(
          (tag) =>
            tag.Key === createdByProviderKey && tag.Value === providerName
        ),
        find((tag) => tag.Key === stageTagKey && tag.Value === stage),
      ]),
      () => true,
      () => false,
    ]),
    tap((minion) => {
      logger.debug(
        `isOurMinion ${minion}, ${tos({ stage, providerName, resource })}`
      );
    }),
  ])(resource.Tags || []);
};

exports.findNameInTags = (item) => {
  assert(item);
  assert(Array.isArray(item.Tags), `no Tags array in ${tos(item)}`);
  const tag = item.Tags.find((tag) => tag.Key === KeyName);
  if (tag?.Value) {
    logger.debug(`findNameInTags ${tag.Value}`);
    return tag.Value;
  } else {
    logger.debug(`findNameInTags: cannot find name`);
  }
};

exports.findNameInDescription = ({ Description = "" }) => {
  const tags = Description.split("tags:")[1];
  if (tags) {
    try {
      const tagsJson = JSON.parse(tags);
      const tag = tagsJson.find((tag) => tag.Key === KeyName);
      if (tag?.Value) {
        logger.debug(`findNameInDescription ${tag.Value}`);
        return tag.Value;
      }
    } catch (error) {
      logger.error(`findNameInDescription ${error}`);
    }
  }
  logger.debug(`findNameInDescription: cannot find name`);
};

exports.getByIdCore = ({ fieldIds, getList }) =>
  tryCatch(
    pipe([
      tap(({ id }) => {
        logger.debug(`getById ${fieldIds} ${id}`);
      }),
      ({ id }) => getList({ params: { [fieldIds]: [id] } }),
      get("items"),
      first,
      tap((item) => {
        logger.debug(`getById  ${fieldIds} result: ${tos(item)}`);
      }),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );
