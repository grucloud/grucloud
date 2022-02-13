const AWS = require("aws-sdk");
const assert = require("assert");
const {
  assign,
  pipe,
  tryCatch,
  tap,
  switchCase,
  and,
  get,
  eq,
  or,
  any,
  not,
} = require("rubico");
const {
  callProp,
  first,
  last,
  find,
  isEmpty,
  forEach,
  identity,
  isFunction,
  includes,
  when,
  unless,
} = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsCommon" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { configProviderDefault } = require("@grucloud/core/Common");

exports.getNewCallerReference = () => `grucloud-${new Date()}`;

const proxyHandler = ({ endpointName, endpoint }) => ({
  get: (target, name, receiver) => {
    assert(endpointName);
    assert(endpoint);
    assert(isFunction(endpoint[name]), `${name} is not a function`);
    return (...args) =>
      retryCall({
        name: `${endpointName}.${name} ${JSON.stringify(args)}`,
        // s3.getSignedUrl does not have promise
        fn: () =>
          new Promise((resolve, reject) => {
            endpoint[name](...args, (error, result) =>
              switchCase([
                () => error,
                () => reject(error),
                () => resolve(result),
              ])()
            );
          }),
        isExpectedResult: () => true,
        config: { retryDelay: 30e3 },
        shouldRetryOnException: ({ error, name }) =>
          pipe([
            tap(() => {
              logger.info(
                `shouldRetryOnException: ${name}, code: ${error.code}`
              );
            }),
            () => [
              "Throttling",
              "UnknownEndpoint",
              "TooManyRequestsException",
              "OperationAborted",
              "TimeoutError",
              "ServiceUnavailable",
            ],
            includes(error.code),
            tap.if(identity, () => {
              logger.info(
                `shouldRetryOnException: ${name}: retrying, code: ${error.code}`
              );
            }),
          ])(),
      });
  },
});

const createEndpoint =
  ({ endpointName }) =>
  (config) =>
    pipe([
      tap(() => AWS.config.update(config)),
      () => new AWS[endpointName]({ region: config.region }),
      (endpoint) => new Proxy({}, proxyHandler({ endpointName, endpoint })),
    ])();

exports.createEndpoint = createEndpoint;

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

exports.KmsNew = (config) => () =>
  createEndpoint({ endpointName: "KMS" })(config);

exports.shouldRetryOnException = ({ error, name }) =>
  pipe([
    tap(() => {
      logger.error(`aws shouldRetryOnException ${tos({ name, error })}`);
      error.stack && logger.error(error.stack);
    }),
    () => error,
    //TODO find out error code we can retry on
    or([eq(get("statusCode"), 503)]),
    tap((retry) => {
      logger.error(`aws shouldRetryOnException ${name}, retry: ${retry}`);
    }),
  ])();

exports.DecodeUserData = when(
  get("UserData"),
  assign({
    UserData: pipe([
      get("UserData"),
      (UserData) => Buffer.from(UserData, "base64").toString(),
    ]),
  })
);

exports.shouldRetryOnExceptionDelete = ({ error, name }) =>
  pipe([
    () => error,
    //TODO not for IamPolicy
    eq(get("code"), "DeleteConflict"),
    tap((retry) => {
      logger.debug(
        `aws shouldRetryOnExceptionDelete ${tos({ name, error, retry })}`
      );
    }),
  ])();

const hasKeyValueInTags =
  ({ key, value }) =>
  ({ live }) =>
    pipe([
      tap(() => {
        assert(key);
        assert(live);
      }),
      () => live,
      get("Tags"),
      any(and([eq(get("Key"), key), eq(get("Value"), value)])),
      tap((result) => {
        assert(true);
      }),
    ])();

exports.hasKeyValueInTags = hasKeyValueInTags;

const hasKeyInTags =
  ({ key }) =>
  ({ live }) =>
    pipe([
      tap(() => {
        assert(key);
        assert(live);
      }),
      () => live,
      get("Tags"),
      tap((Tags) => {
        assert(Tags, `not Tags in ${tos(live)}`);
      }),
      any((tag) => new RegExp(`^${key}*`, "i").test(tag.Key)),
      tap((result) => {
        assert(true);
      }),
    ])();

exports.hasKeyInTags = hasKeyInTags;

const findValueInTags = ({ key }) =>
  pipe([
    tap((live) => {
      assert(key);
      assert(live);
    }),
    get("Tags"),
    find(eq(get("Key"), key)),
    get("Value"),
  ]);

exports.findValueInTags = findValueInTags;

const findEksCluster =
  ({ config, key = "aws:eks:cluster-name" }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives, "lives");
      }),
      () =>
        lives.getByType({
          type: "Cluster",
          group: "EKS",
          providerName: config.providerName,
        }),
      find(eq(get("name"), findValueInTags({ key })(live))),
      tap((cluster) => {
        //logger.debug(`findEksCluster ${!!cluster}`);
      }),
    ])();

exports.findEksCluster = findEksCluster;

const findNamespaceEksCluster =
  ({ config, key = "aws:eks:cluster-name" }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives, "lives");
      }),
      () => findEksCluster({ config, key })({ live, lives }),
      tap((param) => {
        assert(true);
      }),
      findNamespaceInTagsObject(config),
      tap((namespace) => {
        logger.debug(`findNamespace`, namespace);
      }),
    ])();

exports.findNamespaceInTagsOrEksCluster =
  ({ config, key }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives, "lives");
      }),
      () => findNamespaceInTags(config)({ live }),
      switchCase([
        isEmpty,
        () =>
          findNamespaceEksCluster({ config, key })({
            live,
            lives,
          }),
        identity,
      ]),
    ])();

exports.isOurMinionObject = ({ tags, config }) => {
  const {
    stage,
    projectName,
    stageTagKey,
    projectNameKey,
    providerName,
    createdByProviderKey,
  } = config;
  //assert(tags);
  return pipe([
    () => tags,
    tap(() => {
      assert(stage);
      assert(projectName);
      assert(providerName);
    }),
    and([
      eq(get(projectNameKey), projectName),
      eq(get(stageTagKey), stage),
      eq(get(createdByProviderKey), providerName),
    ]),
    tap((minion) => {
      // logger.debug(
      //   `isOurMinionObject ${minion}, ${JSON.stringify({
      //     stage,
      //     projectName,
      //     tags,
      //   })}`
      // );
    }),
  ])();
};

const localeCompare = ({ key, a, b }) => a[key].localeCompare(b[key]);

const sortTags = () =>
  callProp("sort", (a, b) =>
    pipe([
      switchCase([
        () => a.Key,
        () => localeCompare({ a, b, key: "Key" }),
        () => a.key,
        () => localeCompare({ a, b, key: "key" }),
        () => a.TagKey,
        () => localeCompare({ a, b, key: "TagKey" }),
        () => true,
      ]),
    ])()
  );

exports.sortTags = sortTags;

const assignTags = switchCase([
  pipe([get("Tags"), Array.isArray]),
  assign({ Tags: pipe([get("Tags"), sortTags()]) }),
  pipe([get("tags"), Array.isArray]),
  assign({ tags: pipe([get("tags"), sortTags()]) }),
  identity,
]);

exports.assignTags = assignTags;

exports.buildTags = ({
  name,
  config,
  namespace,
  UserTags = [],
  key = "Key",
  value = "Value",
}) => {
  const {
    nameKey,
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    projectNameKey,
    stage,
    providerName,
    projectName,
    namespaceKey,
  } = config;

  assert(name);
  assert(nameKey);
  assert(providerName);
  assert(stage);
  assert(projectName);
  assert(projectNameKey);

  return pipe([
    () => [
      ...UserTags,
      {
        [key]: nameKey,
        [value]: name,
      },
      {
        [key]: managedByKey,
        [value]: managedByValue,
      },
      {
        [key]: createdByProviderKey,
        [value]: providerName,
      },
      {
        [key]: stageTagKey,
        [value]: stage,
      },
      { [key]: projectNameKey, [value]: projectName },
    ],
    unless(
      () => isEmpty(namespace),
      (tags) => [
        ...tags,
        {
          [key]: namespaceKey,
          [value]: namespace,
        },
      ]
    ),
    sortTags(),
  ])();
};

const isOurMinionFactory =
  ({ key = "Key", value = "Value", tags = "Tags" } = {}) =>
  ({ live, config }) => {
    const {
      createdByProviderKey,
      providerName,
      projectNameKey,
      stageTagKey,
      stage,
      projectName,
    } = config;
    return pipe([
      tap(() => {
        assert(createdByProviderKey);
        assert(live);
        assert(stage);
      }),
      () => live,
      get(tags),
      and([
        find(and([eq(get(key), projectNameKey), eq(get(value), projectName)])),
        find(and([eq(get(key), stageTagKey), eq(get(value), stage)])),
      ]),
      tap((minion) => {
        // logger.debug(
        //   `isOurMinion ${minion}, ${JSON.stringify({
        //     stage,
        //     projectName,
        //   })}`
        // );
      }),
    ])();
  };

exports.isOurMinionFactory = isOurMinionFactory;
exports.isOurMinion = isOurMinionFactory({});

exports.tagsExtractFromDescription = pipe([
  get("Description", ""),
  callProp("split", "tags:"),
  last,
  tryCatch(JSON.parse, () => ({})),
  tap((Tags) => {
    assert(true);
  }),
]);

exports.tagsRemoveFromDescription = pipe([
  get("Description", ""),
  callProp("split", "tags:"),
  first,
  callProp("trim"),
  tap((Description) => {
    assert(true);
  }),
]);

const findNamespaceInTags =
  (config) =>
  ({ live }) =>
    pipe([
      tap(() => {
        assert(live);
      }),
      () => live,
      get("Tags"),
      find(eq(get("Key"), config.namespaceKey)),
      get("Value", ""),
    ])();

exports.findNamespaceInTags = findNamespaceInTags;

const findNamespaceInTagsObject =
  (config) =>
  ({ live } = {}) =>
    pipe([
      tap(() => {
        assert(config.namespaceKey);
      }),
      () => live,
      get("tags"),
      get(config.namespaceKey, ""),
      tap(() => {
        assert(true);
      }),
    ])();

exports.findNamespaceInTagsObject = findNamespaceInTagsObject;

const findNameInKeyName = pipe([
  find(eq(get("Key"), configProviderDefault.nameKey)),
  get("Value"),
]);

const findNameInKeyCloudFormation = pipe([
  find(eq(get("Key"), "aws:cloudformation:logical-id")),
  get("Value"),
]);

//TODO params for key and value
const findNameInTags =
  ({ tags = "Tags" } = {}) =>
  ({ live }) =>
    pipe([
      tap(() => {
        if (!live) {
          assert(live);
        }
      }),
      () => live,
      get(tags, []),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        Array.isArray,
        (tags) => {
          for (fn of [findNameInKeyCloudFormation, findNameInKeyName]) {
            const name = fn(tags);
            if (!isEmpty(name)) {
              return name;
            }
          }
        },
        pipe([get(configProviderDefault.nameKey)]),
      ]),
    ])();

exports.findNameInTags = findNameInTags;

exports.findNameInTagsOrId =
  ({ findId, tags }) =>
  ({ live }) =>
    pipe([
      tap(() => {
        //TODO move assert up
        assert(findId);
        if (!live) {
          assert(live);
        }
      }),
      () => ({ live }),
      findNameInTags({ tags }),
      when(isEmpty, pipe([() => findId({ live })])),
      tap((name) => {
        if (!name) {
          assert(name, `cannot find name or id for ${tos(live)}`);
        }
      }),
    ])();

exports.getByIdCore = ({ fieldIds, getList }) =>
  tryCatch(
    pipe([
      tap(({ id }) => {
        logger.debug(`getById ${fieldIds} ${id}`);
        assert(id);
      }),
      ({ id }) => getList({ params: { [fieldIds]: [id] } }),
      //get("items"),
      first,
      tap((item) => {
        logger.debug(`getById  ${fieldIds} result: ${tos(item)}`);
      }),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );

//move to EC2 Common
exports.revokeSecurityGroupIngress =
  ({ ec2 }) =>
  (params) =>
    tryCatch(
      () => ec2().revokeSecurityGroupIngress(params),
      tap.if(
        ({ code }) =>
          !includes(code)([
            "InvalidPermission.NotFound",
            "InvalidGroup.NotFound",
          ]),
        (error) => {
          throw Error(error.message);
        }
      )
    )();

exports.removeRoleFromInstanceProfile =
  ({ iam }) =>
  (params) =>
    tryCatch(
      () => iam().removeRoleFromInstanceProfile(params),
      switchCase([
        eq(get("code"), "NoSuchEntity"),
        () => undefined,
        (error) => {
          logger.error(`iam role removeRoleFromInstanceProfile ${tos(error)}`);
          throw Error(error.message);
        },
      ])
    )();

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
          tap.if(
            not(isEmpty),
            tryCatch(
              (AttachmentId) => ec2().detachNetworkInterface({ AttachmentId }),
              switchCase([
                eq(get("code"), "AuthFailure"),
                () => undefined,
                (error) => {
                  logger.error(
                    `deleteNetworkInterface error code: ${error.code}`
                  );
                  throw Error(error.message);
                },
              ])
            )
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
              or([
                eq(get("code"), "InvalidNetworkInterfaceID.NotFound"),
                eq(get("code"), "InvalidParameterValue"),
              ]),
              (error) => {
                logger.error(
                  `deleteNetworkInterface ignore error code: ${error.code}`
                );
              },
              (error) => {
                logger.error(
                  `deleteNetworkInterface error code: ${error.code}`
                );
                throw Error(error.message);
              },
            ])
          ),
        ])
      )
    ),
  ])();
