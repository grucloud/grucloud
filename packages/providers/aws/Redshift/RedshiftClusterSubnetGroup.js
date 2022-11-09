const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RedshiftCommon");

const pickId = pipe([pick(["ClusterSubnetGroupName"])]);

const model = ({ config }) => ({
  package: "redshift",
  client: "Redshift",
  ignoreErrorCodes: ["ClusterSubnetGroupNotFoundFault"],
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
});

// arn:aws:redshift:region:account-id:subnetgroup:subnet-group-name
const buildArn = ({ accountId, region }) =>
  pipe([
    ({ ClusterSubnetGroupName }) =>
      `arn:aws:redshift:${region}:${accountId()}:subnetgroup:${ClusterSubnetGroupName}`,
  ]);

exports.RedshiftClusterSubnetGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ClusterSubnetGroupName")]),
    findId: pipe([get("live.ClusterSubnetGroupName")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({
          ClusterSubnetGroupName: name,
        }),
        getById({}),
      ]),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { subnets },
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
