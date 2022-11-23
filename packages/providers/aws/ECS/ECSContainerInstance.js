const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, isEmpty, unless } = require("rubico/x");

const { findNameInTagsOrId } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { AwsClient } = require("../AwsClient");
const {
  createECS,
  buildTagsEcs,
  tagResource,
  untagResource,
} = require("./ECSCommon");

const findId = () => get("containerInstanceArn");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html

exports.ECSContainerInstance = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeContainerInstances-property
  const describeContainerInstances = pipe([
    tap(({ cluster }) => {
      assert(cluster);
    }),
    (params) => ecs().describeContainerInstances(params),
    get("containerInstances"),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listContainerInstances-property
  const getList = client.getListWithParent({
    parent: { type: "Cluster", group: "ECS" },
    pickKey: ({ clusterName }) => ({ cluster: clusterName }),

    method: "listContainerInstances",
    getParam: "containerInstanceArns",
    config,
    decorate: ({ lives, parent: { id: cluster, Tags } }) =>
      unless(
        isEmpty,
        pipe([
          (containerInstances) => ({ cluster, containerInstances }),
          describeContainerInstances,
        ])
      ),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#runContainerInstance-property
  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { cluster },
  }) =>
    pipe([
      tap(() => {
        assert(cluster, "missing 'cluster' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        cluster: getField(cluster, "clusterArn"),
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
    ])();

  //TODO do we need this ?
  const create = ({ payload, name, namespace }) =>
    pipe([() => payload, ecs().runContainerInstance])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deregisterContainerInstance-property
  //TODO
  const destroy = ({ live }) => pipe([() => live])();

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther: () => () => true,
    cannotBeDeleted: () => () => true,
    tagResource: tagResource({ ecs }),
    untagResource: untagResource({ ecs }),
  };
};
