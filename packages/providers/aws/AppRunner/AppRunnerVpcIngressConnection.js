const assert = require("assert");
const { pipe, tap, get, eq, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppRunnerCommon");
const { buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("VpcIngressConnectionArn");

const pickId = pipe([pick(["VpcIngressConnectionArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

exports.AppRunnerVpcIngressConnection = () => ({
  type: "VpcIngressConnection",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: () => pipe([get("VpcIngressConnectionName")]),
  findId: () => pipe([get("VpcIngressConnectionArn")]),
  inferName: () => get("VpcIngressConnectionName"),
  omitProperties: [
    "VpcIngressConnectionArn",
    "Status",
    "CreatedAt",
    "AccountId",
    "DomainName",
    "IngressVpcConfiguration",
    "ServiceArn",
  ],
  dependencies: {
    service: {
      type: "Service",
      group: "AppRunner",
      dependencyId: ({ lives, config }) => get("ServiceArn"),
    },
    vpcEndpoint: {
      type: "VpcEndpoint",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("IngressVpcConfiguration.VpcEndpointId"),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeVpcIngressConnection-property
  getById: {
    method: "describeVpcIngressConnection",
    pickId,
    getField: "VpcIngressConnection",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#listVpcIngressConnections-property
  getList: {
    method: "listVpcIngressConnections",
    getParam: "VpcIngressConnectionSummaryList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#createVpcIngressConnection-property
  create: {
    method: "createVpcIngressConnection",
    pickCreated: ({ payload }) => pipe([get("VpcIngressConnection")]),
    isInstanceUp: pipe([eq(get("Status"), "AVAILABLE")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED_CREATION")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#updateVpcIngressConnection-property
  update: {
    method: "updateVpcIngressConnection",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ VpcIngressConnectionArn: live.VpcIngressConnectionArn }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#deleteVpcIngressConnection-property
  destroy: {
    method: "deleteVpcIngressConnection",
    pickId,
    isInstanceDown: pipe([eq(get("Status"), "DELETED")]),
    isInstanceError: pipe([eq(get("Status"), "FAILED_DELETION")]),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { service, vpcEndpoint },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(service);
        assert(vpcEndpoint);
      }),
      () => otherProps,
      defaultsDeep({
        IngressVpcConfiguration: {
          VpcEndpointId: getField(vpcEndpoint, "VpcEndpointId"),
          VpcId: getField(vpcEndpoint, "VpcId"),
        },
        ServiceArn: getField(service, "ServiceArn"),
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
