const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
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
exports.EC2PublicIpv4Pool = () => ({
  type: "PublicIpv4Pool",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "PoolId",
    "CreatedDate",
    "UpdatedDate",
    "PoolAddressRanges",
    "TotalAddressCount",
    "TotalAvailableAddressCount",
    "NetworkBorderGroup",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "InvalidPublicIpv4PoolID.NotFound",
    "InvalidPublicIpv4Pool.NotFound",
  ],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describePublicIpv4Pools-property
  getById: {
    method: "describePublicIpv4Pools",
    getField: "PublicIpv4Pools",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describePublicIpv4Pools-property
  getList: {
    method: "describePublicIpv4Pools",
    getParam: "PublicIpv4Pools",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createPublicIpv4Pool-property
  create: {
    method: "createPublicIpv4Pool",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deletePublicIpv4Pool-property
  destroy: {
    method: "deletePublicIpv4Pool",
    pickId: pipe([
      tap(({ PoolId }) => {
        assert(PoolId);
      }),
      pick(["PoolId"]),
    ]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "ipv4pool-ec2",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
