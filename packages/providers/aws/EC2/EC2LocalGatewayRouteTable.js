const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("LocalGatewayRouteTableId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2LocalGatewayRouteTable = () => ({
  type: "LocalGatewayRouteTable",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "LocalGatewayRouteTableId",
    "LocalGatewayRouteTableArn",
    "LocalGatewayId",
    "OutpostArn",
    "OwnerId",
    "State",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    //  "InvalidParameterValue",
    // TODO remove
    "InvalidLocalGatewayRouteTableID.Malformed",
  ],
  dependencies: {
    localGateway: {
      type: "LocalGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LocalGatewayId"),
          tap((LocalGatewayId) => {
            assert(LocalGatewayId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeLocalGatewayRouteTables-property
  getById: {
    method: "describeLocalGatewayRouteTables",
    getField: "LocalGatewayRouteTables",
    pickId: pipe([
      tap(({ LocalGatewayRouteTableId }) => {
        assert(LocalGatewayRouteTableId);
      }),
      ({ LocalGatewayRouteTableId }) => ({
        LocalGatewayRouteTableIds: [LocalGatewayRouteTableId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeLocalGatewayRouteTables-property
  getList: {
    method: "describeLocalGatewayRouteTables",
    getParam: "LocalGatewayRouteTables",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createLocalGatewayRouteTable-property
  create: {
    method: "createLocalGatewayRouteTable",
    pickCreated: ({ payload }) => pipe([get("LocalGatewayRouteTable")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteLocalGatewayRouteTable-property
  destroy: {
    method: "deleteLocalGatewayRouteTable",
    pickId: pipe([
      tap(({ LocalGatewayRouteTableId }) => {
        assert(LocalGatewayRouteTableId);
      }),
      pick(["LocalGatewayRouteTableId"]),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { localGateway },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(localGateway);
      }),
      () => otherProps,
      defaultsDeep({
        LocalGatewayId: getField(localGateway, "LocalGatewayId"),
        TagSpecifications: [
          {
            ResourceType: "local-gateway-route-table",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
