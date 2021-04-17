process.env.AWS_SDK_LOAD_CONFIG = "true";
const AWS = require("aws-sdk");
const assert = require("assert");
const {
  pipe,
  tryCatch,
  tap,
  switchCase,
  and,
  get,
  eq,
  or,
  not,
} = require("rubico");
const { first, find, isEmpty, forEach } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsCommon" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { KeyName } = require("@grucloud/core/Common");

exports.getNewCallerReference = () => `grucloud-${new Date()}`;

const handler = ({ endpointName, endpoint }) => ({
  get: (target, name, receiver) => {
    assert(endpointName);
    assert(endpoint);
    return (...args) =>
      retryCall({
        name: `${endpointName}.${name} ${JSON.stringify(args)}`,
        fn: () => endpoint[name](...args).promise(),
        isExpectedResult: () => true,
        shouldRetryOnException: ({ error, name }) =>
          pipe([
            tap((error) => {
              logger.info(`${name}: ${tos(error)}`);
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
  createEndpoint({ endpointName: "S3" })({ region: "us-east-1" });

exports.Route53New = (config) => () =>
  createEndpoint({ endpointName: "Route53" })(config);

exports.CloudFrontNew = (config) => () =>
  createEndpoint({ endpointName: "CloudFront" })(config);

exports.Route53DomainsNew = () => () =>
  createEndpoint({ endpointName: "Route53Domains" })({ region: "us-east-1" });

exports.ACMNew = (config) => () =>
  createEndpoint({ endpointName: "ACM" })(config);

exports.EKSNew = (config) => () =>
  createEndpoint({ endpointName: "EKS" })(config);

exports.ELBNew = (config) => () =>
  createEndpoint({ endpointName: "ELB" })(config);

exports.ELBv2New = (config) => () =>
  createEndpoint({ endpointName: "ELBv2" })(config);

exports.AutoScalingNew = (config) => () =>
  createEndpoint({ endpointName: "AutoScaling" })(config);

exports.shouldRetryOnException = ({ error, name }) =>
  pipe([
    tap(() => {
      logger.error(`aws shouldRetryOnException ${tos({ name, error })}`);
      error.stack && logger.error(error.stack);
    }),
    //TODO find out error code we can retry on
    or([
      () => [503].includes(error.statusCode),
      eq(get("code"), "OperationAborted"),
    ]),
    tap((retry) => {
      logger.error(`aws shouldRetryOnException retry: ${retry}`);
    }),
  ])(error);

//TODO use pipe
exports.shouldRetryOnExceptionDelete = ({ error, name }) => {
  logger.debug(`shouldRetryOnException ${tos({ name, error })}`);
  const retry = error.code === "DeleteConflict";
  logger.debug(`shouldRetryOnException retry: ${retry}`);
  return retry;
};

exports.buildTags = ({ name, config, UserTags = [] }) => {
  const {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    stage,
    providerName,
    projectName,
  } = config;

  assert(name);
  assert(providerName);
  assert(stage);
  assert(projectName);

  return [
    ...UserTags,
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
    { Key: "projectName", Value: projectName },
  ];
};

exports.isOurMinion = ({ resource, config }) => {
  const {
    createdByProviderKey,
    providerName,
    stageTagKey,
    stage,
    projectName,
  } = config;
  return pipe([
    tap(() => {
      assert(createdByProviderKey);
      assert(resource);
      assert(stage);
    }),
    () => resource,
    get("Tags"),
    switchCase([
      and([
        find(
          and([eq(get("Key"), "projectName"), eq(get("Value"), projectName)])
        ),
        find(and([eq(get("Key"), stageTagKey), eq(get("Value"), stage)])),
      ]),
      () => true,
      () => false,
    ]),
    tap((minion) => {
      logger.debug(
        `isOurMinion ${minion}, ${JSON.stringify({
          stage,
          projectName,
        })}`
      );
    }),
  ])();
};

const findNameInTags = (item) =>
  pipe([
    tap(() => {
      assert(item);
    }),
    () => item,
    get("Tags"),
    find(eq(get("Key"), KeyName)),
    get("Value"),
    switchCase([
      isEmpty,
      () => {
        logger.debug(
          `findNameInTags: no name in tags: ${JSON.stringify(item.Tags)}`
        );
      },
      (Value) => {
        logger.debug(`findNameInTags found name: ${Value}`);
        return Value;
      },
    ]),
  ])();

exports.findNameInTags = findNameInTags;

exports.findNameInTagsOrId = ({ item, findId }) =>
  pipe([
    findNameInTags,
    switchCase([isEmpty, () => findId(item), (name) => name]),
  ])(item);

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

exports.destroyNetworkInterfaces = ({ ec2, Name, Values }) =>
  pipe([
    tap(() => {
      assert(ec2);
      assert(Name);
      assert(Array.isArray(Values));
    }),
    () =>
      ec2().describeNetworkInterfaces({
        Filters: [{ Name, Values }],
      }),
    get("NetworkInterfaces", []),
    tap((NetworkInterfaces) => {
      logger.debug(`#NetworkInterfaces ${NetworkInterfaces.length}`);
    }),
    tap(
      forEach(
        pipe([
          get("Attachment.AttachmentId"),
          tap.if(not(isEmpty), (AttachmentId) =>
            ec2().detachNetworkInterface({ AttachmentId })
          ),
        ])
      )
    ),
    tap(
      forEach(
        pipe([
          get("NetworkInterfaceId"),
          tap((NetworkInterfaceId) => {
            logger.debug(`deleteNetworkInterface: ${NetworkInterfaceId}`);
            assert(NetworkInterfaceId);
          }),
          tryCatch(
            (NetworkInterfaceId) =>
              ec2().deleteNetworkInterface({ NetworkInterfaceId }),
            switchCase([
              eq(get("code"), "InvalidNetworkInterfaceID.NotFound"),
              () => undefined,
              (error) => {
                logger.error(
                  `deleteNetworkInterface error code: ${error.code}`
                );
                throw error;
              },
            ])
          ),
        ])
      )
    ),
  ])();
