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
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSCapacityProvider",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

const findName = get("live.clusterName");
const findId = get("live.capacityProviderArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSCapacityProvider = ({ spec, config }) => {
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeCapacityProviders-property
  const describeCapacityProviders = pipe([
    tap((params) => {
      assert(true);
    }),
    ecs().describeCapacityProviders,
    get("capacityProviders"),
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
        () => ({ capacityProviders: [name] }),
        describeCapacityProviders,
      ]),
      switchCase([
        eq(get("code"), "ClientException"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  const getList = () => pipe([describeCapacityProviders])();

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCapacityProvider-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      ecs().createCapacityProvider,
      tap(() =>
        retryCall({
          name: `createCapacityProvider isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCapacityProvider-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      tap(({ name }) => {
        assert(name);
      }),
      ({ name }) => ({ capacityProvider: name }),
      tryCatch(
        pipe([
          ecs().deleteCapacityProvider,
          () =>
            retryCall({
              name: `deleteCapacityProvider isDownByName: ${live.name}`,
              fn: () => isDownByName({ name: live.name }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(
                `error deleteCapacityProvider ${tos({ params, error })}`
              );
            }),
            () => error,
            switchCase([
              eq(get("code"), "ClientException"),
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
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name,
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
