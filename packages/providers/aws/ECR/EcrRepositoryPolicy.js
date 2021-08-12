const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, first } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "EcrRepositoryPolicy",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findName = get("live.repositoryName");
const findId = get("live.repositoryId");
const pickParam = pick(["repositoryName", "registryId"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html
exports.EcrRepositoryPolicy = ({ spec, config }) => {
  const ecr = () => createEndpoint({ endpointName: "ECR" })(config);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
  ]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRepositoryPolicy-property
  const getList = () =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Repository",
          group: "ecr",
        }),
      map(({ live }) =>
        pipe([() => live, pickParam, ecr().getRepositoryPolicy])()
      ),
      (items = []) => ({
        total: items.length,
        items,
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#getRepositoryPolicy-property
  const getByName = ({ dependencies: { repository } }) =>
    pipe([
      tap(() => {
        assert(repository);
      }),
      () => repository.live,
      pickParam,
      tap(({ repositoryName }) => {
        assert(repositoryName);
      }),
      tryCatch(ecr().getRepositoryPolicy, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error getRepositoryPolicy ${tos({ params, error })}`);
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#setRepositoryPolicy-property
  const create = ({ payload, name }) =>
    pipe([
      tap((params) => {
        assert(payload.repositoryName);
      }),
      () => payload,
      ecr().setRepositoryPolicy,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#deleteRepositoryPolicy-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.repositoryName);
      }),
      () => live,
      pickParam,
      tryCatch(ecr().deleteRepositoryPolicy, (error, params) =>
        pipe([
          tap(() => {
            logger.error(
              `error deleteRepositoryPolicy ${tos({ params, error })}`
            );
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { repository },
  }) =>
    pipe([
      () => properties,
      tap(({ policyText }) => {
        assert(policyText, "missing 'policyText' property");
      }),
      defaultsDeep({
        repositoryName: getField(repository, "repositoryName"),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
