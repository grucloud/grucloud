const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findVpcId = pipe([get("Attachments"), first, get("VpcId")]);

const pickId = pipe([
  pick(["InternetGatewayId"]),
  tap(({ InternetGatewayId }) => {
    assert(InternetGatewayId);
  }),
]);
const findId = () =>
  pipe([
    get("InternetGatewayId"),
    tap((InternetGatewayId) => {
      assert(InternetGatewayId);
    }),
  ]);

const findName = ({ lives, config }) =>
  pipe([
    switchCase([
      isDefault({ lives, config }),
      () => "ig-default",
      findNameInTagsOrId({ findId })({ lives, config }),
    ]),
  ]);

const isDefault =
  ({ lives, config: { providerName } }) =>
  (live) =>
    pipe([
      lives.getByType({ type: "Vpc", group: "EC2", providerName }),
      find(get("live.IsDefault")),
      switchCase([
        eq(get("live.VpcId", ""), findVpcId(live)),
        () => true,
        () => false,
      ]),
    ])();

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2InternetGateway = ({ compare }) => ({
  type: "InternetGateway",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: [
    "InvalidInternetGatewayID.NotFound",
    "InvalidInternetGatewayId.Malformed",
  ],
  findName,
  findId,
  omitProperties: ["Attachments", "InternetGatewayId", "OwnerId"],
  isDefault,
  cannotBeDeleted: isDefault,
  managedByOther: isDefault,
  getById: {
    pickId: pipe([
      tap(({ InternetGatewayId }) => {
        assert(InternetGatewayId);
      }),
      ({ InternetGatewayId }) => ({ InternetGatewayIds: [InternetGatewayId] }),
    ]),
    method: "describeInternetGateways",
    getField: "InternetGateways",
    decorate,
  },
  getList: {
    method: "describeInternetGateways",
    getParam: "InternetGateways",
  },
  create: {
    method: "createInternetGateway",
    pickCreated: () =>
      pipe([
        get("InternetGateway"),
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  destroy: {
    pickId,
    method: "deleteInternetGateway",
    ignoreErrorCodes: [
      "InvalidInternetGatewayID.NotFound",
      "InvalidInternetGatewayId.Malformed",
    ],
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "internet-gateway",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
