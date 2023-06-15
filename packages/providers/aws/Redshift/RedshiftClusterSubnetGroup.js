const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RedshiftCommon");

const pickId = pipe([
  tap(({ ClusterSubnetGroupName }) => {
    assert(ClusterSubnetGroupName);
  }),
  pick(["ClusterSubnetGroupName"]),
]);

const managedByOther = () =>
  pipe([eq(get("ClusterSubnetGroupName"), "default")]);

// arn:aws:redshift:region:account-id:subnetgroup:subnet-group-name
const buildArn = ({ accountId, region }) =>
  pipe([
    ({ ClusterSubnetGroupName }) =>
      `arn:${
        config.partition
      }:redshift:${region}:${accountId()}:subnetgroup:${ClusterSubnetGroupName}`,
  ]);

exports.RedshiftClusterSubnetGroup = ({ compare }) => ({
  type: "ClusterSubnetGroup",
  package: "redshift",
  client: "Redshift",
  ignoreErrorCodes: ["ClusterSubnetGroupNotFoundFault"],
  omitProperties: ["VpcId", "SubnetGroupStatus", "Subnets", "SubnetIds"],
  inferName: () => get("ClusterSubnetGroupName"),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Subnets"), pluck("SubnetIdentifier")]),
    },
  },
  findName: () => pipe([get("ClusterSubnetGroupName")]),
  findId: () => pipe([get("ClusterSubnetGroupName")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterSubnetGroups-property
  getById: {
    method: "describeClusterSubnetGroups",
    getField: "ClusterSubnetGroups",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterSubnetGroups-property
  getList: {
    method: "describeClusterSubnetGroups",
    getParam: "ClusterSubnetGroups",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createClusterSubnetGroup-property
  create: {
    method: "createClusterSubnetGroup",
    pickCreated: ({ payload }) => pipe([get("ClusterSubnetGroup")]),
    isInstanceUp: pipe([eq(get("SubnetGroupStatus"), "Complete")]),
    isInstanceError: pipe([eq(get("SubnetGroupStatus"), "Invalid")]),
    getErrorMessage: get("SubnetGroupStatus", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#modifyClusterSubnetGroup-property
  update: {
    method: "modifyClusterSubnetGroup",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteClusterSubnetGroup-property
  destroy: {
    method: "deleteClusterSubnetGroup",
    pickId,
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        ClusterSubnetGroupName: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          userTags: Tags,
        }),
      }),
      assign({
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ]),
      }),
    ])(),
});
