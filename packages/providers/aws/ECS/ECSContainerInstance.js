const assert = require("assert");
const { pipe, tap, tryCatch, get, not, flatMap, filter } = require("rubico");
const { defaultsDeep, isEmpty, unless, first } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "ECSContainerInstance",
});
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.containerInstanceArn");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSContainerInstance = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ecs = () => createEndpoint({ endpointName: "ECS" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Cluster",
      group: "ECS",
      ids: [live.clusterArn],
    },
    {
      type: "Instance",
      group: "EC2",
      ids: [live.ec2InstanceId],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeContainerInstances-property
  const describeContainerInstances = pipe([
    tap(({ cluster }) => {
      assert(cluster);
    }),
    ecs().describeContainerInstances,
    get("containerInstances"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listContainerInstances-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Cluster",
          group: "ECS",
        }),
      flatMap(
        pipe([
          get("id"),
          (cluster) =>
            pipe([
              () => ({ cluster }),
              ecs().listContainerInstances,
              get("containerInstanceArns"),
              unless(
                isEmpty,
                pipe([
                  (containerInstances) => ({ cluster, containerInstances }),
                  describeContainerInstances,
                ])
              ),
            ])(),
        ])
      ),
      filter(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#runContainerInstance-property
  const create = ({ payload, name, namespace }) =>
    pipe([() => payload, ecs().runContainerInstance])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deregisterContainerInstance-property
  const destroy = ({ live }) => pipe([() => live])();

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
    managedByOther: () => true,
    cannotBeDeleted: () => true,
  };
};
