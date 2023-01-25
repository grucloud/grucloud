const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => pipe([get("EgressOnlyInternetGatewayId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2EgressOnlyInternetGateway = () => ({
  type: "EgressOnlyInternetGateway",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidGatewayID.NotFound"],
  findName: pipe([findNameInTagsOrId({ findId })]),
  findId,
  omitProperties: [
    "Attachments",
    "EgressOnlyInternetGatewayId",
    "OwnerId",
    "VpcId",
  ],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attachments"), first, get("VpcId")]),
    },
  },
  // findDependencies: ({ live, lives }) => [
  //   {
  //     type: "Vpc",
  //     group: "EC2",
  //     ids: [pipe([() => live, get("Attachments"), first, get("VpcId")])()],
  //   },
  // ],
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
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
    config,
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
