const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("PoolId"),
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
exports.EC2CoipPool = () => ({
  type: "CoipPool",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "PoolId",
    "PoolCidrs",
    "LocalGatewayRouteTableId",
    "PoolArn",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidParameterValue",
    // TODO remove
    "InvalidPoolID.Malformed",
  ],
  dependencies: {
    localGatewayRouteTable: {
      type: "LocalGatewayRouteTable",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LocalGatewayRouteTableId"),
          tap((LocalGatewayRouteTableId) => {
            assert(LocalGatewayRouteTableId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCoipPools-property
  getById: {
    method: "describeCoipPools",
    getField: "CoipPools",
    pickId: pipe([
      tap(({ PoolId }) => {
        assert(PoolId);
      }),
      ({ PoolId }) => ({
        PoolIds: [PoolId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeCoipPools-property
  getList: {
    method: "describeCoipPools",
    getParam: "CoipPools",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createCoipPool-property
  create: {
    method: "createCoipPool",
    pickCreated: ({ payload }) => pipe([get("CoipPool")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteCoipPool-property
  destroy: {
    method: "deleteCoipPool",
    pickId: pipe([
      tap(({ PoolId }) => {
        assert(PoolId);
      }),
      ({ PoolId }) => ({ CoipPoolId: PoolId }),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { localGatewayRouteTable },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(localGatewayRouteTable);
      }),
      () => otherProps,
      defaultsDeep({
        LocalGatewayRouteTableId: getField(
          localGatewayRouteTable,
          "LocalGatewayRouteTableId"
        ),
        TagSpecifications: [
          {
            ResourceType: "coip-pool",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
