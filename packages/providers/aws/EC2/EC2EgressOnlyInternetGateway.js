const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const findId = pipe([get("live.EgressOnlyInternetGatewayId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidGatewayID.NotFound"],
  getById: {
    pickId: pipe([
      ({ EgressOnlyInternetGatewayId }) => ({
        EgressOnlyInternetGatewayIds: [EgressOnlyInternetGatewayId],
      }),
    ]),
    method: "describeEgressOnlyInternetGateways",
    getField: "EgressOnlyInternetGateways",
  },
  getList: {
    method: "describeEgressOnlyInternetGateways",
    getParam: "EgressOnlyInternetGateways",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  create: {
    method: "createEgressOnlyInternetGateway",
    pickCreated: ({ payload }) => pipe([get("EgressOnlyInternetGateway")]),
    isInstanceUp: pipe([
      get("Attachments"),
      first,
      eq(get("State"), "attached"),
    ]),
  },
  destroy: {
    method: "deleteEgressOnlyInternetGateway",
    pickId: pick(["EgressOnlyInternetGatewayId"]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2EgressOnlyInternetGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([findNameInTagsOrId({ findId })]),
    findId,
    findDependencies: ({ live, lives }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [pipe([() => live, get("Attachments"), first, get("VpcId")])()],
      },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { vpc },
    }) =>
      pipe([
        tap((params) => {
          assert(vpc);
        }),
        () => otherProps,
        defaultsDeep({
          VpcId: getField(vpc, "VpcId"),
          TagSpecifications: [
            {
              ResourceType: "egress-only-internet-gateway",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
