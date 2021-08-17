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
  flatMap,
} = require("rubico");
const { defaultsDeep, isEmpty, includes, first } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSService",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.serviceArn");
const findName = get("live.serviceName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSService = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Cluster",
      group: "ecs",
      ids: [pipe([() => live, get("clusterArn")])()],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const isInvalidArn = pipe([
    tap((params) => {
      assert(true);
    }),
    eq(
      get("message"),
      "The specified capacity provider does not exist. Specify a valid name or ARN and try again."
    ),
  ]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeServices-property
  const describeServices = pipe([
    tap((params) => {
      assert(true);
    }),
    ecs().describeServices,
    get("services"),
    tap((params) => {
      assert(true);
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#getParameter-property
  const getByName = ({ name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(name);
        }),
        () => ({ services: [name] }),
        describeServices,
        first,
        tap((params) => {
          assert(true);
        }),
      ]),
      switchCase([
        isInvalidArn,
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listServices-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Cluster",
          group: "ecs",
        }),
      flatMap(
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("id"),
          tap((params) => {
            assert(true);
          }),
          (cluster) => ({ cluster }),
          ecs().listServices,
          get("serviceArns"),
          (services) => ({ services }),
          describeServices,
        ])
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  const isInstanceUp = eq(get("status"), "ACTIVE");
  const isUpByName = pipe([getByName, isInstanceUp]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createService-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      ecs().createService,
      tap(() =>
        retryCall({
          name: `createService isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteService-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      tap(({ serviceName }) => {
        assert(serviceName);
      }),
      ({ serviceName }) => ({ service: serviceName }),
      tryCatch(
        pipe([
          ecs().deleteService,
          () =>
            retryCall({
              name: `deleteService isDownByName: ${live.serviceName}`,
              fn: () => isDownByName({ name: live.serviceName }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteService ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              isInvalidArn,
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
    properties: { Tags, ...otherProps },
    dependencies: { cluster },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        serviceName: name,
        cluster: getField(cluster, "clusterArn"),
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
          key: "key",
          value: "value",
        }),
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
