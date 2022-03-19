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
  gte,
  or,
  any,
  not,
  omit,
  fork,
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
  size,
  unless,
  pluck,
  keys,
  isDeepEqual,
  differenceWith,
} = require("rubico/x");
const util = require("util");
const Diff = require("diff");

const logger = require("@grucloud/core/logger")({ prefix: "AwsCommon" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { configProviderDefault, compare } = require("@grucloud/core/Common");

const isAwsError = (code) =>
  pipe([
    tap((params) => {
      assert(true);
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

exports.getNewCallerReference = () => `grucloud-${new Date()}`;

const extractKeys = ({ key }) =>
  switchCase([Array.isArray, pipe([pluck(key)]), keys]);

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
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    assign({
      diffTags: ({ targetTags, liveTags }) =>
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
      assign({
        hasTagsDiff: gte(pipe([get("tags.diffTags"), size]), 2),
        hasDataDiff: and([
          gte(pipe([get("jsonDiff"), size]), 2),
          or([
            pipe([get("liveDiff.needUpdate")]),
            pipe([get("liveDiff.added"), not(isEmpty)]),
            pipe([get("liveDiff.updated"), not(isEmpty)]),
            pipe([get("liveDiff.deleted"), not(isEmpty)]),
          ]),
        ]),
      }),
      assign({
        hasDiff: or([get("hasTagsDiff"), get("hasDataDiff")]),
      }),
      tap((params) => {
        assert(true);
      }),
    ]);

const proxyHandler = ({ endpointName, endpoint }) => ({
  get: (target, name, receiver) => {
    //assert(endpointName);
    assert(endpoint);
    assert(isFunction(endpoint[name]), `${name} is not a function`);
    return (...args) =>
      retryCall({
        name: `${endpointName}.${name} ${JSON.stringify(args)}`,
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
              logger.info(
                `shouldRetryOnException: ${name}, error: ${util.inspect(error)}`
              );
              logger.info(
                `shouldRetryOnException: name: ${error.name}, code: ${error.code}`
              );
            }),
            or([
              pipe([
                () => ["ECONNRESET", "ENETDOWN", "EPROTO"],
                includes(error.code),
              ]),
              pipe([
                () => [
                  "Throttling",
                  "UnknownEndpoint",
                  "TooManyRequestsException",
                  "OperationAborted",
                  "TimeoutError",
                  "ServiceUnavailable",
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

const createEndpoint = (client) => (config) =>
  pipe([
    tap((params) => {
      assert(client);
      assert(config.region);
    }),
    () => new client({ region: config.region }),
    (endpoint) =>
      new Proxy({}, proxyHandler({ endpointName: client.name, endpoint })),
  ]);

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
  ({ live }) =>
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

const assignTagsSort = pipe([
  switchCase([
    pipe([get("Tags"), Array.isArray]),
    assign({ Tags: pipe([get("Tags"), sortTags()]) }),
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
  ({ live } = {}) =>
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

exports.removeRoleFromInstanceProfile =
  ({ iam }) =>
  (params) =>
    tryCatch(
      pipe([() => params, iam().removeRoleFromInstanceProfile]),
      switchCase([
        //TODO use throwIfNotAwsError
        isAwsError("NoSuchEntity"),
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
                isAwsError("AuthFailure"),
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
                isAwsError("InvalidNetworkInterfaceID.NotFound"),
                isAwsError("InvalidParameterValue"),
                isAwsError("OperationNotPermitted"),
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

exports.lambdaAddPermission = ({ lambda, lambdaFunction, SourceArn }) =>
  pipe([
    tap.if(
      () => lambdaFunction,
      ({ IntegrationId }) =>
        pipe([
          () => ({
            Action: "lambda:InvokeFunction",
            FunctionName: lambdaFunction.resource.name,
            Principal: "apigateway.amazonaws.com",
            StatementId: IntegrationId,
            SourceArn: SourceArn(),
          }),
          lambda().addPermission,
        ])()
    ),
  ]);

exports.destroyAutoScalingGroupById = ({ autoScalingGroup, lives, config }) =>
  pipe([
    (id) =>
      lives.getById({
        id,
        providerName: config.providerName,
        type: "AutoScalingGroup",
        group: "AutoScaling",
      }),
    get("name"),
    unless(
      isEmpty,
      pipe([
        (AutoScalingGroupName) => ({ live: { AutoScalingGroupName } }),
        autoScalingGroup.destroy,
      ])
    ),
  ]);

exports.ignoreResourceCdk = () =>
  pipe([get("name"), callProp("startsWith", "cdk-")]);
