const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./Route53RecoveryControlConfigCommon");

const findId = pipe([get("live.ClusterArn")]);
const pickId = pipe([
  pick(["ClusterArn"]),
  tap(({ ClusterArn }) => {
    assert(ClusterArn);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignTags({ endpoint, findId }),
    tap((params) => {
      assert(true);
    }),
    ({ Name, ...other }) => ({ ClusterName: Name, ...other }),
  ]);

const model = ({ config }) => ({
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeCluster-property
  getById: {
    method: "describeCluster",
    pickId,
    getField: "Cluster",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listClusters-property
  getList: {
    method: "listClusters",
    getParam: "Clusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createCluster-property
  create: {
    method: "createCluster",
    pickCreated: ({ payload }) => pipe([get("Cluster"), pickId]),
    isInstanceUp: eq(get("Status"), "DEPLOYED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#updateCluster-property
  update: {
    method: "updateCluster",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#deleteCluster-property
  destroy: { method: "deleteCluster", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigCluster = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ClusterName")]),
    findId,
    getByName: getByNameCore,
    tagResource: tagResource({ findId }),
    untagResource: untagResource({ findId }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
