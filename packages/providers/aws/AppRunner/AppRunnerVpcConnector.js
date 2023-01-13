const assert = require("assert");
const { pipe, tap, get, eq, assign, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppRunnerCommon");
const { buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("VpcConnectorArn");

const pickId = pipe([pick(["VpcConnectorArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

exports.AppRunnerVpcConnector = () => ({
  type: "VpcConnector",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: () => pipe([get("VpcConnectorName")]),
  findId: () => pipe([get("VpcConnectorArn")]),
  inferName: () => get("VpcConnectorName"),
  omitProperties: [
    "VpcConnectorRevision",
    "VpcConnectorArn",
    "Status",
    "CreatedAt",
    "DeletedAt",
    "Subnets",
    "SecurityGroups",
  ],
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("Subnets"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroups"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeVpcConnector-property
  getById: {
    method: "describeVpcConnector",
    pickId,
    getField: "VpcConnector",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#listVpcConnectors-property
  getList: {
    method: "listVpcConnectors",
    getParam: "VpcConnectors",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#createVpcConnector-property
  create: {
    method: "createVpcConnector",
    pickCreated: ({ payload }) => pipe([get("VpcConnector")]),
    isInstanceUp: pipe([eq(get("Status"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#updateVpcConnector-property
  update: {
    method: "updateVpcConnector",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ VpcConnectorArn: live.VpcConnectorArn }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#deleteVpcConnector-property
  destroy: {
    method: "deleteVpcConnector",
    pickId,
    isInstanceDown: pipe([eq(get("Status"), "INACTIVE")]),
  },
  getByName: getByNameCore,
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
      tap((params) => {
        assert(subnets);
        assert(securityGroups);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      assign({
        Subnets: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ]),
        SecurityGroups: pipe([
          () => securityGroups,
          map((sg) => getField(sg, "GroupId")),
        ]),
      }),
    ])(),
});
