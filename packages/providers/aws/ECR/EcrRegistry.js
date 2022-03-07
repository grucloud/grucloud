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
} = require("rubico");
const { defaultsDeep, isEmpty, when, isDeepEqual, size } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "EcrRegistry" });
const { AwsClient } = require("../AwsClient");
const { throwIfNotAwsError } = require("../AwsCommon");

const { createECR } = require("./ECRCommon");

const findName = () => "default";
const findId = get("live.registryId");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html
exports.EcrRegistry = ({ spec, config }) => {
  const ecr = createECR(config);
  const client = AwsClient({ spec, config })(ecr);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([() => ""]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRegistryPolicy-property
  const getRegistryPolicy = tryCatch(
    pipe([() => ecr().getRegistryPolicy({}), get("policyText"), JSON.parse]),
    throwIfNotAwsError("RegistryPolicyNotFoundException")
  );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#describeRegistry-property
  const describeRegistry = () =>
    pipe([
      () => ({}),
      ecr().describeRegistry,
      when(
        pipe([get("replicationConfiguration.rules"), isEmpty]),
        omit(["replicationConfiguration"])
      ),
      assign({
        policyText: getRegistryPolicy,
      }),
      omitIfEmpty(["policyText"]),
    ])();

  const getList = () => pipe([describeRegistry, (registry) => [registry]])();

  const getByName = pipe([describeRegistry]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#putRegistryPolicy-property
  const putRegistryPolicy = ({ compare }) =>
    pipe([
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
  const putReplicationConfiguration = ({ compare }) =>
    pipe([
      tap((params) => {
        logger.debug(`putReplicationConfiguration ${JSON.stringify(params)}`);
      }),
      switchCase([
        get("replicationConfiguration"),
        pick(["replicationConfiguration"]),
        () => ({ replicationConfiguration: { rules: [] } }),
      ]),
      (live) =>
        pipe([
          () => live,
          ecr().putReplicationConfiguration,
          () =>
            retryCall({
              name: `putReplicationConfiguration is updated ?`,
              fn: pipe([
                ecr().describeRegistry,
                pick(["replicationConfiguration"]),
                (liveNew) => compare({ live: liveNew, target: live }),
                eq(pipe([get("jsonDiff"), size]), 1),
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
        () => ecr().deleteRegistryPolicy({}),
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
      throwIfNotAwsError("RegistryPolicyNotFoundException")
    ),
    tap((params) => {
      logger.debug("deleteRegistryPolicy done");
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRegistryPolicy-property
  const updateOrDeleteRegistryPolicy = ({ compare }) =>
    pipe([
      switchCase([
        get("policyText"),
        putRegistryPolicy({ compare }),
        deleteRegistryPolicy,
      ]),
    ]);

  const update = ({ payload, name, diff, compare }) =>
    pipe([
      tap((params) => {
        logger.debug("registry update");
        assert(compare);
      }),
      () => payload,
      tap(updateOrDeleteRegistryPolicy({ compare })),
      tap(putReplicationConfiguration({ compare })),
      tap((params) => {
        logger.debug("registry updated");
      }),
    ])();

  //TODO Tags ?
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
    cannotBeDeleted: () => true,
  };
};
