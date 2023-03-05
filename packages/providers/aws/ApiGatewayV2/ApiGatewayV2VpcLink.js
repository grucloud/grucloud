const assert = require("assert");
const { map, pipe, tap, eq, get, assign, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { Tagger, ignoreErrorCodes } = require("./ApiGatewayV2Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html

const pickId = pipe([pick(["VpcLinkId"])]);

const buildArn =
  ({ config }) =>
  ({ VpcLinkId }) =>
    `arn:aws:apigateway:${config.region}::/vpclinks/${VpcLinkId}`;

exports.ApiGatewayV2VpcLink = ({ spec, config }) => ({
  type: "VpcLink",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => get("VpcLinkId"),
  getByName: getByNameCore,
  ignoreErrorCodes,
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
  },
  omitProperties: [
    "CreatedDate",
    "SecurityGroupIds",
    "SubnetIds",
    "VpcLinkId",
    "VpcLinkStatus",
    "VpcLinkStatusMessage",
    "VpcLinkVersion",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getVpcLink-property
  getById: {
    method: "getVpcLink",
    pickId,
    decorate: ({ endpoint }) => pipe([assign({})]),
  },
  getList: { method: "getVpcLinks", getParam: "Items" },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createVpcLink-property
  create: {
    method: "createVpcLink",
    isInstanceError: eq(get("VpcLinkStatus"), "FAILED"),
    getErrorMessage: get("VpcLinkStatusMessage", "FAILED"),
    isInstanceUp: eq(get("VpcLinkStatus"), "AVAILABLE"),
  },
  update: { method: "updateVpcLink" },
  destroy: { method: "deleteVpcLink", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets, securityGroups },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
