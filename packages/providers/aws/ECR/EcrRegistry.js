const assert = require("assert");
const {
  switchCase,
  tryCatch,
  pipe,
  tap,
  get,
  pick,
  assign,
  omit,
  eq,
  not,
  and,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  when,
  isDeepEqual,
  size,
  prepend,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "EcrRegistry" });
const { throwIfNotAwsError } = require("../AwsCommon");

const { Tagger } = require("./ECRCommon");

const managedByOther = () =>
  pipe([not(and([get("policyText"), get("replicationConfiguration")]))]);

const pickId = () => ({});

const findName = () => () => "default";

const findId = () =>
  pipe([
    get("registryId"),
    tap((registryId) => {
      assert(registryId);
    }),
    prepend("arn::aws::"),
  ]);

const emptyReplication = { replicationConfiguration: { rules: [] } };

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRegistryPolicy-property
const getRegistryPolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tryCatch(
      pipe([
        () => ({}),
        endpoint().getRegistryPolicy,
        get("policyText"),
        JSON.parse,
      ]),
      throwIfNotAwsError("RegistryPolicyNotFoundException")
    ),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    when(
      pipe([get("replicationConfiguration.rules"), isEmpty]),
      omit(["replicationConfiguration"])
    ),
    assign({
      policyText: getRegistryPolicy({ endpoint }),
    }),
    omitIfEmpty(["policyText"]),
  ]);

const deleteRegistryPolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    tryCatch(
      pipe([
        () => ({}),
        endpoint().deleteRegistryPolicy,
        () =>
          retryCall({
            name: `deleteRegistryPolicy is down ?`,
            fn: pipe([
              getRegistryPolicy({ endpoint }),
              isEmpty,
              tap((isDown) => {
                logger.debug(`deleteRegistryPolicy isDown: ${isDown}`);
              }),
            ]),
            config: {
              repeatCount: 1,
              repeatDelay: 5e3,
              retryCount: 60,
              retryDelay: 2e3,
            },
          }),
      ]),
      throwIfNotAwsError("RegistryPolicyNotFoundException")
    ),
    tap((params) => {
      logger.debug("deleteRegistryPolicy done");
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putRegistryPolicy-property
const putRegistryPolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      logger.debug("putRegistryPolicy");
    }),
    get("policyText"),
    (policyText) =>
      pipe([
        () => policyText,
        JSON.stringify,
        (policyText) => ({ policyText }),
        endpoint().putRegistryPolicy,
        () =>
          retryCall({
            name: `putRegistryPolicy is updated`,
            fn: pipe([
              getRegistryPolicy({ endpoint }),
              (newPolicy) => isDeepEqual(newPolicy, policyText),
            ]),
            config: { retryCount: 60, retryDelay: 2e3 },
          }),
      ])(),
  ]);

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putReplicationConfiguration-property
const putReplicationConfiguration = ({ endpoint, compare }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(compare);
    }),
    switchCase([
      get("replicationConfiguration"),
      pick(["replicationConfiguration"]),
      () => emptyReplication,
    ]),
    (live) =>
      pipe([
        () => live,
        endpoint().putReplicationConfiguration,
        () =>
          retryCall({
            name: `putReplicationConfiguration is updated ?`,
            fn: pipe([
              endpoint().describeRegistry,
              pick(["replicationConfiguration"]),
              (liveNew) =>
                compare({
                  live: liveNew,
                  target: defaultsDeep(emptyReplication)(live),
                }),
              eq(get("hasDiff"), false),
              tap((equal) => {
                logger.debug(`putReplicationConfiguration equal: ${equal}`);
              }),
            ]),
            config: {
              repeatCount: 1,
              repeatDelay: 5e3,
              retryCount: 60,
              retryDelay: 2e3,
            },
          }),
      ])(),
    tap((params) => {
      logger.debug(`putReplicationConfiguration done`);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRegistryPolicy-property
const updateOrDeleteRegistryPolicy = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    switchCase([
      get("policyText"),
      putRegistryPolicy({ endpoint }),
      deleteRegistryPolicy({ endpoint }),
    ]),
  ]);

exports.ECRRegistry = ({ compare }) => ({
  type: "Registry",
  package: "ecr",
  client: "ECR",
  propertiesDefault: {},
  omitProperties: ["registryId"],
  inferName: findName,
  findName: findName,
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  managedByOther,
  filterLive: () => pipe([pick(["policyText", "replicationConfiguration"])]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRegistry-property
  getById: {
    method: "describeRegistry",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRegistry-property
  getList: {
    method: "describeRegistry",
    decorate,
  },
  // No create, only update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#updateRegistry-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff, compare }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(compare);
        }),
        () => payload,
        tap(updateOrDeleteRegistryPolicy({ endpoint })),
        tap(putReplicationConfiguration({ endpoint, compare })),
        tap((params) => {
          logger.debug("registry updated");
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRegistry-property
  destroy:
    ({ endpoint, getById }) =>
    ({ live, lives, config }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(compare);
        }),
        () => ({}),
        tap(updateOrDeleteRegistryPolicy({ endpoint })),
        tap(putReplicationConfiguration({ endpoint, compare: compare({}) })),
      ])(),
  getByName: getByNameCore,
  // tagger: ({ config }) =>
  //   Tagger({
  //     buildArn: buildArn({ config }),
  //   }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        //TODO
        //Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
