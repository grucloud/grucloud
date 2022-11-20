const assert = require("assert");
const { pipe, tap, get, eq, assign, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppRunnerCommon");
const { buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("VpcConnectorArn");

const pickId = pipe([pick(["VpcConnectorArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const model = ({ config }) => ({
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
});

exports.AppRunnerVpcConnector = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("VpcConnectorName")]),
    findId: () => pipe([get("VpcConnectorArn")]),
    getByName: getByNameCore,
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
      dependencies: { subnets, securityGroups },
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
