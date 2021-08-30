const assert = require("assert");
const { detailedDiff } = require("deep-object-diff");
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
  or,
} = require("rubico");
const { defaultsDeep, isEmpty, when, isDeepEqual } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({ prefix: "EcrRegistry" });
const { tos } = require("@grucloud/core/tos");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");

const findName = () => "default";
const findId = get("live.registryId");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html
exports.EcrRegistry = ({ spec, config }) => {
  const ecr = () => createEndpoint({ endpointName: "ECR" })(config);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRegistryPolicy-property
  const getRegistryPolicy = tryCatch(
    pipe([() => ({}), ecr().getRegistryPolicy, get("policyText"), JSON.parse]),
    switchCase([
      eq(get("code"), "RegistryPolicyNotFoundException"),
      () => undefined,
      () => {
        throw error;
      },
    ])
  );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRegistry-property
  const describeRegistry = () =>
    pipe([
      () => ({}),
      ecr().describeRegistry,
      tap((params) => {
        assert(true);
      }),
      //TODO omit if Empty
      when(
        pipe([get("replicationConfiguration.rules"), isEmpty]),
        omit(["replicationConfiguration"])
      ),
      assign({
        policyText: getRegistryPolicy,
      }),
      when(pipe([get("policyText"), isEmpty]), omit(["policyText"])),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getList = () => pipe([describeRegistry, (registry) => [registry]])();

  const getByName = pipe([describeRegistry]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putRegistryPolicy-property

  const putRegistryPolicy = pipe([
    tap((params) => {
      logger.debug("putRegistryPolicy");
    }),
    get("policyText"),
    (policyText) =>
      pipe([
        () => policyText,
        JSON.stringify,
        (policyText) => ({ policyText }),
        ecr().putRegistryPolicy,
        () =>
          retryCall({
            name: `putRegistryPolicy is updated`,
            fn: pipe([
              getRegistryPolicy,
              (newPolicy) => isDeepEqual(newPolicy, policyText),
            ]),
            config: { retryCount: 60, retryDelay: 2e3 },
          }),
      ])(),
  ]);

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putReplicationConfiguration-property
  const putReplicationConfiguration = pipe([
    tap((params) => {
      logger.debug(`putReplicationConfiguration ${JSON.stringify(params)}`);
    }),
    switchCase([
      get("replicationConfiguration"),
      pick(["replicationConfiguration"]),
      () => ({ replicationConfiguration: { rules: [] } }),
    ]),
    (param) =>
      pipe([
        () => param,
        ecr().putReplicationConfiguration,
        () =>
          retryCall({
            name: `putReplicationConfiguration is updated ?`,
            fn: pipe([
              ecr().describeRegistry,
              pick(["replicationConfiguration"]),
              tap((params) => {
                assert(true);
              }),
              (paramUpdated) => isDeepEqual(paramUpdated, param),
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

  const deleteRegistryPolicy = pipe([
    tap((params) => {
      logger.debug("deleteRegistryPolicy");
    }),
    tryCatch(
      pipe([
        () => ({}),
        ecr().deleteRegistryPolicy,
        () =>
          retryCall({
            name: `deleteRegistryPolicy is down ?`,
            fn: pipe([
              getRegistryPolicy,
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
      switchCase([
        eq(get("code"), "RegistryPolicyNotFoundException"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    ),
    tap((params) => {
      logger.debug("deleteRegistryPolicy done");
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRegistryPolicy-property
  const updateOrDeleteRegistryPolicy = pipe([
    switchCase([get("policyText"), putRegistryPolicy, deleteRegistryPolicy]),
  ]);

  const update = ({ payload, name, diff }) =>
    pipe([
      tap((params) => {
        logger.debug("registry update");
      }),
      () => payload,
      tap(updateOrDeleteRegistryPolicy),
      tap(putReplicationConfiguration),
      tap((params) => {
        logger.debug("registry updated");
      }),
    ])();

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([() => properties, defaultsDeep({})])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    update,
    getList,
    configDefault,
    shouldRetryOnException,
    cannotBeDeleted: () => true,
  };
};

const filterTarget = pipe([get("target", {}), omit(["Tags"])]);
const filterLive = ({ live }) => pipe([() => live, omit(["registryId"])])();

//TODO remove, use common one
exports.compareRegistry = pipe([
  tap((xxx) => {
    assert(true);
  }),
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([() => detailedDiff(target, live), omit([])])(),
    liveDiff: pipe([() => detailedDiff(live, target), omit([])])(),
  }),
  tap((diff) => {
    logger.debug(`compareRegistry ${tos(diff)}`);
  }),
]);
