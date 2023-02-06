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
  omit,
  fork,
  map,
  filter,
} = require("rubico");
const {
  defaultsDeep,
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
  pluck,
  keys,
  isDeepEqual,
  differenceWith,
  isObject,
  values,
} = require("rubico/x");
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const Diff = require("diff");
const { fromIni } = require("@aws-sdk/credential-providers");

const logger = require("@grucloud/core/logger")({ prefix: "AwsCommon" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  configProviderDefault,
  compare,
  assignHasDiff,
  replaceWithName,
} = require("@grucloud/core/Common");

const dependenciesFromEnv = {
  apiGatewayRestApis: {
    pathLive: "live.url",
    type: "RestApi",
    group: "APIGateway",
  },
  apiGatewayV2Apis: {
    pathLive: "id",
    type: "Api",
    group: "ApiGatewayV2",
  },
  appsyncGraphqlApis: {
    pathLive: "live.uris.GRAPHQL",
    type: "GraphqlApi",
    group: "AppSync",
  },
  cognitoUserPools: {
    pathLive: "id",
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
  },
  cognitoUserPoolClient: {
    pathLive: "id",
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
  },
  // dynamoDbTables: {
  //   pathLive: "live.TableName",
  //   type: "Table",
  //   group: "DynamoDB",
  // },
  rdsDbClusters: {
    pathLive: "live.DBClusterArn",
    type: "DBCluster",
    group: "RDS",
  },
  // s3Buckets: {
  //   pathLive: "name",
  //   type: "Bucket",
  //   group: "S3",
  // },
  secretsManagerSecrets: {
    pathLive: "live.ARN",
    type: "Secret",
    group: "SecretsManager",
  },
  snsTopics: {
    pathLive: "id",
    type: "Topic",
    group: "SNS",
  },
  // ssmParameters: {
  //   pathLive: "name",
  //   type: "Parameter",
  //   group: "SSM",
  // },
};

exports.replaceEnv =
  ({ lives, providerConfig }) =>
  (idToMatch) =>
    pipe([
      () => dependenciesFromEnv,
      find(({ type, group, pathLive }) =>
        pipe([
          () => lives,
          tap((params) => {
            assert(true);
          }),

          any(
            and([
              eq(get("type"), type),
              eq(get("group"), group),
              pipe([get(pathLive), (id) => idToMatch.startsWith(id)]),
            ])
          ),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        isEmpty,
        pipe([() => idToMatch, replaceAccountAndRegion({ providerConfig })]),
        ({ type, group, pathLive }) =>
          pipe([
            () => idToMatch,
            replaceWithName({
              groupType: `${group}::${type}`,
              path: pathLive,
              pathLive,
              providerConfig,
              lives,
              withSuffix: true,
            }),
          ])(),
      ]),
    ])();

const buildDependencyFromEnv =
  ({ pathEnvironment }) =>
  ({ pathLive, type, group }) => ({
    type,
    group,
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        get(pathEnvironment),
        map((value) =>
          pipe([
            tap((params) => {
              assert(value);
              assert(pathLive);
            }),
            lives.getByType({
              providerName: config.providerName,
              type,
              group,
            }),
            find(pipe([get(pathLive), (id) => value.startsWith(id)])),
            get("id"),
          ])()
        ),
        values,
      ]),
  });

exports.buildDependenciesFromEnv = ({ pathEnvironment }) =>
  pipe([
    () => dependenciesFromEnv,
    map(buildDependencyFromEnv({ pathEnvironment })),
    tap((params) => {
      assert(true);
    }),
  ])();

const sortObject = pipe([
  Object.entries,
  callProp("sort", (a, b) => a[0].localeCompare(b[0])),
  Object.fromEntries,
]);

exports.arnFromId = ({ config, service }) =>
  pipe([
    tap((id) => {
      assert(config.region);
      assert(config.accountId());
      assert(service);
      assert(id);
    }),
    (id) =>
      `arn:${config.partition || "aws"}:${service}:${
        config.region
      }:${config.accountId()}:${id}`,
  ]);

const isAwsError = (code) =>
  pipe([
    tap((params) => {
      assert(code);
    }),
    eq(get("name"), code),
  ]);

exports.isAwsError = isAwsError;

const throwIfNotAwsError = (code) =>
  switchCase([
    isAwsError(code),
    () => undefined,
    (error) => {
      throw error;
    },
  ]);

exports.throwIfNotAwsError = throwIfNotAwsError;

const replaceValueFromConfig =
  ({ providerConfig }) =>
  (value) =>
    pipe([
      tap((params) => {
        assert(providerConfig);
      }),
      () => providerConfig,
      Object.entries,
      find(eq(last, value)),
      first,
      switchCase([
        isEmpty,
        () => value,
        pipe([(key) => `config.${key}`, (resource) => () => resource]),
      ]),
    ])();

exports.assignValueFromConfig = ({ providerConfig, key }) =>
  assign({
    [key]: pipe([get(key), replaceValueFromConfig({ providerConfig })]),
  });

exports.replaceRegionAll =
  ({ providerConfig }) =>
  (region) =>
    pipe([
      tap((params) => {
        assert(providerConfig);
      }),
      () => providerConfig,
      Object.entries,
      find(eq(last, region)),
      first,
      switchCase([
        isEmpty,
        () => region,
        pipe([(key) => `config.${key}`, (resource) => () => resource]),
      ]),
    ])();

exports.replaceRegion = ({ providerConfig }) =>
  pipe([
    tap((params) => {
      assert(providerConfig);
      assert(providerConfig.region);
    }),
    when(
      includes(providerConfig.region),
      pipe([
        callProp("replaceAll", providerConfig.region, "${config.region}"),
        (resource) => () => "`" + resource + "`",
      ])
    ),
  ]);

exports.replaceOwner = ({ providerConfig }) =>
  pipe([
    tap((params) => {
      assert(providerConfig.accountId());
    }),
    callProp("replace", providerConfig.accountId(), "${config.accountId()}"),
    (resource) => () => "`" + resource + "`",
  ]);

exports.getNewCallerReference = () => `grucloud-${uuidv4()}`;

const extractKeys = ({ key }) =>
  switchCase([Array.isArray, pipe([pluck(key)]), keys]);

const filterTags = pipe([
  switchCase([
    Array.isArray,
    filter(
      not(
        pipe([
          switchCase([
            get("Key"),
            get("Key"),
            get("key"),
            get("key"),
            () => "",
          ]),
          callProp("startsWith", "aws"),
        ])
      )
    ),
    isObject,
    pipe([
      Object.entries,
      filter(not(pipe([first, callProp("startsWith", "aws:")]))),
      Object.fromEntries,
    ]),
    () => {
      assert(false, "tags should be an array or object");
    },
  ]),
]);

const compareAwsTags = ({ getTargetTags, getLiveTags, tagsKey, key }) =>
  pipe([
    tap((params) => {
      assert(tagsKey);
    }),
    fork({
      targetTags: pipe([
        get("target"),
        switchCase([() => getTargetTags, getTargetTags, get(tagsKey, [])]),
      ]),
      liveTags: pipe([
        get("live"),
        switchCase([() => getLiveTags, getLiveTags, get(tagsKey, [])]),
        filterTags,
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    assign({
      diffTags: ({ targetTags = [], liveTags = [] }) =>
        Diff.diffJson(liveTags, targetTags),
      targetKeys: pipe([get("targetTags"), extractKeys({ key })]),
      liveKeys: pipe([get("liveTags"), extractKeys({ key })]),
    }),
    tap((params) => {
      assert(true);
    }),
    assign({
      removedKeys: ({ targetKeys, liveKeys }) =>
        pipe([() => targetKeys, differenceWith(isDeepEqual, liveKeys)])(),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

exports.compareAws =
  ({
    getTargetTags,
    getLiveTags,
    omitTargetKey,
    tagsKey = "Tags",
    key = "Key",
  }) =>
  ({ filterAll, filterTarget, filterLive } = {}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      fork({
        tags: compareAwsTags({ getTargetTags, getLiveTags, tagsKey, key }),
        payloadDiff: compare({
          filterAll,
          filterTarget,
          filterTargetDefault: omit([omitTargetKey, tagsKey]),
          filterLive,
          filterLiveDefault: omit([tagsKey, "$metadata"]),
        }),
      }),
      tap((params) => {
        assert(true);
      }),
      ({ payloadDiff, tags }) => ({ ...payloadDiff, tags }),
      tap((params) => {
        assert(true);
      }),
      assignHasDiff,
      tap((params) => {
        assert(true);
      }),
    ]);

const proxyHandler = ({ endpointName, endpoint }) => ({
  get: (target, name, receiver) => {
    //assert(endpointName);
    assert(endpoint);
    if (!isFunction(endpoint[name])) {
      assert(isFunction(endpoint[name]), `${name} is not a function`);
    }
    return (...args) =>
      retryCall({
        name: `${endpointName}.${name}`,
        //name: `${endpointName}.${name} ${JSON.stringify(args)}`,
        fn: pipe([
          () => endpoint[name](...args),
          tap((params) => {
            assert(true);
          }),
          omit(["$metadata", "Status"]),
        ]),
        isExpectedResult: () => true,
        config: { retryDelay: 30e3 },
        shouldRetryOnException: ({ error, name }) =>
          pipe([
            tap(() => {
              // logger.info(
              //   `shouldRetryOnException: ${name}, error: ${util.inspect(error)}`
              // );
              logger.info(
                `shouldRetryOnException: name: ${error.name}, code: ${error.code}, message: ${error.message}`
              );
            }),
            or([
              pipe([
                //TODO common with Retry.js
                () => [
                  "ECONNRESET",
                  "ENETDOWN",
                  "EPROTO",
                  "ENOTFOUND",
                  "EHOSTUNREACH",
                ],
                includes(error.code),
              ]),
              pipe([
                () => [
                  "Throttling",
                  "ThrottlingException",
                  "UnknownEndpoint",
                  "TooManyRequestsException",
                  "OperationAborted",
                  "TimeoutError",
                  "ServiceUnavailable",
                  "RequestLimitExceeded",
                  "SyntaxError", // SDK v3 JSON.parse exception
                ],
                includes(error.name),
              ]),
            ]),
            tap.if(identity, () => {
              logger.info(
                `shouldRetryOnException: ${name}: retrying, name: ${error.name}`
              );
            }),
          ])(),
      });
  },
});

const createEndpointOption = (config) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    (region) => ({ region }),
    when(
      () => config.region,
      defaultsDeep({
        region: config.region,
      })
    ),
    when(
      () => process.env.AWS_REGION,
      defaultsDeep({
        region: process.env.AWS_REGION,
      })
    ),
    when(
      () => process.env.AWSAccessKeyId,
      defaultsDeep({
        credentials: {
          accessKeyId: process.env.AWSAccessKeyId,
          secretAccessKey: process.env.AWSSecretKey,
        },
      })
    ),
    when(
      () => config.credentials,
      defaultsDeep({ credentials: fromIni(config.credentials) })
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

exports.createEndpointOption = createEndpointOption;

const createEndpointProxy =
  (regionForce) =>
  (client) =>
  (config) =>
  (configOverride = {}) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(config);
        assert(config.region);
        assert(configOverride);
        // logger.debug(
        //   `createEndpointProxy ${client.name}, region: ${config.region}`
        // );
      }),
      () => regionForce,
      createEndpointOption(config),
      tap(({ region }) => {
        assert(region);
      }),
      (options) => new client({ ...options, ...configOverride }),
      (endpoint) =>
        new Proxy({}, proxyHandler({ endpointName: client.name, endpoint })),
    ])();

const createEndpoint = (packageName, entryPoint, regionForce) =>
  pipe([
    tap((params) => {
      assert(packageName);
    }),
    () => `@aws-sdk/client-${packageName}`,
    require,
    tap((params) => {
      assert(true);
    }),
    get(entryPoint),
    tap((endpoint) => {
      assert(endpoint, `no endpoint ${packageName}:${entryPoint}`);
    }),
    createEndpointProxy(regionForce),
  ])();

exports.createEndpoint = createEndpoint;

exports.DecodeUserData = when(
  get("UserData"),
  assign({
    UserData: pipe([
      get("UserData"),
      (UserData) => Buffer.from(UserData, "base64").toString(),
    ]),
  })
);

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
  (live) =>
    pipe([
      tap(() => {
        assert(key);
        assert(live);
      }),
      () => live,
      get("Tags", []),
      tap((Tags) => {
        //assert(Tags, `not Tags in ${tos(live)}`);
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
  ({ lives, config, key = "aws:eks:cluster-name" }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(lives, "lives");
      }),
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
        assert(live, "live");
      }),
      () => live,
      findEksCluster({ config, lives, key }),
      tap((param) => {
        assert(true);
      }),
      unless(isEmpty, () => findNamespaceInTagsObject({ config })(live)),
      tap((namespace) => {
        //  logger.debug(`findNamespace`, namespace);
      }),
    ])();

exports.findNamespaceInTagsOrEksCluster =
  ({ config, key }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives, "lives");
        assert(live);
      }),
      () => findNamespaceInTags(config)({ live }),
      when(isEmpty, () =>
        findNamespaceEksCluster({ config, key })({
          live,
          lives,
        })
      ),
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

const assignTagsSort = pipe([
  switchCase([
    pipe([get("Tags"), Array.isArray]),
    assign({ Tags: pipe([get("Tags"), sortTags()]) }),
    pipe([get("TagsList"), Array.isArray]),
    //CloudTrail
    assign({ TagsList: pipe([get("TagsList"), sortTags()]) }),
    pipe([get("tags"), Array.isArray]),
    assign({ tags: pipe([get("tags"), sortTags()]) }),
    identity,
  ]),
  when(
    get("labels"),
    assign({
      labels: pipe([
        get("labels"),
        Object.entries,
        callProp("sort"),
        Object.fromEntries,
      ]),
    })
  ),
]);

exports.assignTagsSort = assignTagsSort;

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

  // assert(name);
  assert(nameKey);
  assert(providerName);
  assert(stage);
  assert(projectName);
  assert(projectNameKey);

  return pipe([
    () => [
      ...UserTags,
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
      () => isEmpty(name),
      (tags) => [
        ...tags,
        {
          [key]: nameKey,
          [value]: name,
        },
      ]
    ),
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
//TODO
const findNamespaceInTags =
  ({ config }) =>
  (live) =>
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
  ({ config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(config.namespaceKey);
        assert(live);
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
  (live) =>
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
          for (fn of [findNameInKeyName, findNameInKeyCloudFormation]) {
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
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        //TODO move assert up
        if (!config) {
          assert(config);
        }
        if (!live) {
          assert(live);
        }
      }),
      () => live,
      findNameInTags({ tags }),
      when(isEmpty, pipe([() => live, findId({ lives, config })])),
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
        //logger.debug(`getById  ${fieldIds} result: ${tos(item)}`);
      }),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );

//move to EC2 Common
exports.revokeSecurityGroupIngress =
  ({ endpoint }) =>
  (params) =>
    tryCatch(
      () => endpoint().revokeSecurityGroupIngress(params),
      tap.if(
        ({ name }) =>
          !includes(name)([
            "InvalidPermission.NotFound",
            "InvalidGroup.NotFound",
          ]),
        (error) => {
          throw Error(error.message);
        }
      )
    )();

exports.removeRoleFromInstanceProfile = ({ endpoint }) =>
  tryCatch(
    pipe([
      tap(({ RoleName, InstanceProfileName }) => {
        assert(RoleName);
        assert(InstanceProfileName);
      }),
      endpoint().removeRoleFromInstanceProfile,
    ]),
    switchCase([
      //TODO use throwIfNotAwsError
      isAwsError("NoSuchEntityException"),
      () => undefined,
      (error) => {
        logger.error(`iam role removeRoleFromInstanceProfile ${tos(error)}`);
        throw Error(error.message);
      },
    ])
  );

exports.destroyNetworkInterfaces =
  ({ endpoint }) =>
  ({ Name, Values }) =>
    pipe([
      tap(() => {
        assert(endpoint);
        assert(Name);
        assert(Array.isArray(Values));
      }),
      () => ({
        Filters: [{ Name, Values }],
      }),
      endpoint().describeNetworkInterfaces,
      get("NetworkInterfaces", []),
      tap((NetworkInterfaces) => {
        logger.debug(
          `#NetworkInterfaces ${JSON.stringify(NetworkInterfaces, null, 4)}`
        );
      }),
      forEach(
        pipe([
          ({ NetworkInterfaceId, Attachment }) =>
            retryCall({
              name: `detachNetworkInterface NetworkInterfaceId ${NetworkInterfaceId}, AttachmentId: ${Attachment?.AttachmentId}`,
              fn: pipe([
                // detachNetworkInterface
                () => Attachment,
                get("AttachmentId"),
                unless(
                  isEmpty,
                  tryCatch(
                    pipe([
                      (AttachmentId) => ({
                        AttachmentId,
                        Force: true,
                      }),
                      endpoint().detachNetworkInterface,
                    ]),
                    // Ignore error
                    (error) => {
                      logger.info(
                        `detachNetworkInterface shouldRetryOnException: error: ${error.name}`
                      );
                    }
                  )
                ),
                // deleteNetworkInterface
                () => ({ NetworkInterfaceId }),
                endpoint().deleteNetworkInterface,
              ]),
              isExpectedResult: () => true,
              config: { retryDelay: 10e3, retryCount: 45 * 6 },
              isExpectedException: pipe([
                or([isAwsError("InvalidNetworkInterfaceID.NotFound")]),
              ]),
              shouldRetryOnException: ({ error, name }) =>
                pipe([
                  tap(() => {
                    logger.info(
                      `deleteNetworkInterface shouldRetryOnException: ${name}, error: ${util.inspect(
                        error
                      )}`
                    );
                  }),
                  () => error,
                  // TODO isAwsErrors
                  switchCase([
                    or([
                      isAwsError("InvalidParameterValue"),
                      isAwsError("OperationNotPermitted"),
                      isAwsError("InvalidNetworkInterface.InUse"),
                    ]),
                    () => true,
                    () => false,
                  ]),
                ])(),
            }),
        ])
      ),
    ])();

exports.ignoreResourceCdk = () =>
  pipe([get("name"), callProp("startsWith", "cdk-")]);

const replaceArnWithAccountAndRegion =
  ({ providerConfig, lives }) =>
  (Id) =>
    pipe([
      tap((params) => {
        assert(lives);
      }),
      () => lives,
      switchCase([
        // DynamoDB stream
        pipe([
          and([
            () => Id.startsWith("arn:aws:dynamodb"),
            () => Id.includes("/stream/"),
          ]),
        ]),
        pipe([
          () => Id,
          replaceWithName({
            groupType: "DynamoDB::Table",
            path: "live.LatestStreamArn",
            pathLive: "live.LatestStreamArn",
            providerConfig,
            lives,
          }),
        ]),
        //  replaceWithName
        or([
          () =>
            Id.startsWith(
              "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity"
            ),
          any(
            and([
              ({ id }) => Id.startsWith(id),
              //TODO
              () =>
                !Id.endsWith("amazonaws.com") &&
                Id != providerConfig.accountId() &&
                !Id.startsWith("arn:aws:ecr") &&
                !Id.startsWith("arn:aws:kinesis") &&
                !Id.startsWith("arn:aws:lambda") &&
                !Id.startsWith("arn:aws:dynamodb") &&
                !Id.startsWith("arn:aws:es") &&
                !Id.startsWith("arn:aws:firehose") &&
                !Id.startsWith("arn:aws:events") &&
                !Id.startsWith("arn:aws:rds") &&
                !Id.startsWith("arn:aws:sqs") &&
                !Id.startsWith("arn:aws:code") &&
                !Id.startsWith("arn:aws:logs") &&
                !Id.startsWith("arn:aws:glacier") &&
                !Id.startsWith("arn:aws:states") &&
                !Id.startsWith("arn:aws:ssm") &&
                !Id.startsWith(`arn:aws:iam::${providerConfig.accountId()}`) &&
                !Id.startsWith("arn:aws:sns") &&
                !Id.startsWith("arn:aws:s3"),
            ])
          ),
        ]),
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => Id,
          replaceWithName({
            path: "id",
            providerConfig,
            lives,
          }),
        ]),

        // Default - replace region and account
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => Id,
          callProp(
            "replace",
            new RegExp(providerConfig.accountId(), "g"),
            "${config.accountId()}"
          ),
          callProp(
            "replace",
            new RegExp(providerConfig.region, "g"),
            "${config.region}"
          ),
          when(not(eq(identity, Id)), (resource) => () => "`" + resource + "`"),
        ]),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.replaceArnWithAccountAndRegion = replaceArnWithAccountAndRegion;

const replaceAccountAndRegion =
  ({ providerConfig }) =>
  (prop = "") =>
    pipe([
      tap((params) => {
        //assert(prop);
      }),
      () => prop,
      callProp(
        "replace",
        new RegExp(providerConfig.accountId(), "g"),
        "${config.accountId()}"
      ),
      callProp(
        "replace",
        new RegExp(providerConfig.region, "g"),
        "${config.region}"
      ),
      switchCase([
        eq(identity, prop),
        identity,
        (resource) => () => "`" + resource + "`",
      ]),
    ])();

exports.replaceAccountAndRegion = replaceAccountAndRegion;

const assignPolicyResource = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(providerConfig);
    }),
    when(
      get("Resource"),
      assign({
        Resource: pipe([
          get("Resource"),
          switchCase([
            Array.isArray,
            map(replaceArnWithAccountAndRegion({ providerConfig, lives })),
            replaceArnWithAccountAndRegion({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

exports.assignPolicyResource = assignPolicyResource;

const replacePrincipal = ({ providerConfig, lives, principalKind }) =>
  pipe([
    when(
      get(principalKind),
      assign({
        [principalKind]: pipe([
          get(principalKind),
          switchCase([
            Array.isArray,
            map(replaceArnWithAccountAndRegion({ providerConfig, lives })),
            replaceArnWithAccountAndRegion({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

const replaceCondition = ({ conditionCriteria, providerConfig, lives }) =>
  when(
    get(conditionCriteria),
    assign({
      [conditionCriteria]: pipe([
        get(conditionCriteria),
        map(
          pipe([
            switchCase([
              Array.isArray,
              map(
                replaceArnWithAccountAndRegion({
                  providerConfig,
                  lives,
                })
              ),
              replaceArnWithAccountAndRegion({
                providerConfig,
                lives,
              }),
            ]),
          ])
        ),
      ]),
    })
  );

const replaceStatement = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    when(
      get("Principal"),
      assign({
        Principal: pipe([
          get("Principal"),
          replacePrincipal({ providerConfig, lives, principalKind: "Service" }),
          replacePrincipal({ providerConfig, lives, principalKind: "AWS" }),
          replacePrincipal({
            providerConfig,
            lives,
            principalKind: "Federated",
          }),
          when(
            get("AWS"),
            assign({
              AWS: pipe([
                get("AWS"),
                when(
                  includes("CloudFront Origin Access Identity"),
                  pipe([
                    replaceWithName({
                      groupType: "CloudFront::OriginAccessIdentity",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ])
                ),
              ]),
            })
          ),
        ]),
      })
    ),
    when(
      get("Condition"),
      assign({
        Condition: pipe([
          get("Condition"),
          replaceCondition({
            conditionCriteria: "ArnLike",
            providerConfig,
            lives,
          }),
          replaceCondition({
            conditionCriteria: "StringLike",
            providerConfig,
            lives,
          }),
          when(
            get("StringEquals"),
            assign({
              StringEquals: pipe([
                get("StringEquals"),
                map(
                  switchCase([
                    Array.isArray,
                    map(
                      replaceArnWithAccountAndRegion({
                        providerConfig,
                        lives,
                      })
                    ),
                    replaceArnWithAccountAndRegion({
                      providerConfig,
                      lives,
                    }),
                  ])
                ),
                when(
                  get("elasticfilesystem:AccessPointArn"),
                  assign({
                    "elasticfilesystem:AccessPointArn": pipe([
                      get("elasticfilesystem:AccessPointArn"),
                      replaceWithName({
                        groupType: "EFS::AccessPoint",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
                sortObject,
              ]),
            })
          ),
          when(
            get("ArnEquals"),
            assign({
              ArnEquals: pipe([
                get("ArnEquals"),
                when(
                  get("aws:PrincipalArn"),
                  assign({
                    "aws:PrincipalArn": pipe([
                      get("aws:PrincipalArn"),
                      replaceArnWithAccountAndRegion({
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
                when(
                  get("aws:SourceArn"),
                  assign({
                    "aws:SourceArn": pipe([
                      get("aws:SourceArn"),
                      replaceArnWithAccountAndRegion({
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      })
    ),
    assignPolicyResource({ providerConfig, lives }),
  ]);

const assignPolicyAccountAndRegion = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      Statement: pipe([
        get("Statement"),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          Array.isArray,
          map(replaceStatement({ providerConfig, lives })),
          replaceStatement({ providerConfig, lives }),
        ]),
      ]),
    }),
  ]);

exports.assignPolicyAccountAndRegion = assignPolicyAccountAndRegion;

exports.assignPolicyDocumentAccountAndRegion = ({ providerConfig, lives }) =>
  assign({
    PolicyDocument: pipe([
      tap((params) => {
        assert(true);
      }),
      get("PolicyDocument"),
      assignPolicyAccountAndRegion({ providerConfig, lives }),
    ]),
  });
