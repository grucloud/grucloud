const { get, pipe, tap, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const assert = require("assert");

const { getByNameCore } = require("@grucloud/core/Common");
const { findNameInTagsOrId, buildTags } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () => get("AllocationId");
const pickId = pick(["AllocationId"]);

const decorate = ({ endpoint, lives, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(lives);
      assert(config);
    }),
    assign({
      Arn: pipe([
        ({ AllocationId }) =>
          `arn:aws:ec2:${
            config.region
          }:${config.accountId()}:eip-allocation/${AllocationId}`,
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html
exports.EC2ElasticIpAddress = ({ compare }) => ({
  type: "ElasticIpAddress",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "InstanceId",
    "PublicIp",
    "AllocationId",
    "AssociationId",
    "NetworkInterfaceId",
    "NetworkInterfaceOwnerId",
    "PrivateIpAddress",
    "PublicIpv4Pool",
    "NetworkBorderGroup",
  ],
  filterLive: () => pick([]),
  //compare: compare({ filterAll: () => pipe([pick([])]) }),
  dependencies: {},
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["InvalidAllocationID.NotFound"],
  getById: {
    method: "describeAddresses",
    getField: "Addresses",
    pickId: ({ AllocationId }) => ({
      AllocationIds: [AllocationId],
    }),
    decorate,
  },
  getList: {
    method: "describeAddresses",
    getParam: "Addresses",
    decorate,
  },
  create: {
    method: "allocateAddress",
  },
  destroy: {
    method: "releaseAddress",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      defaultsDeep({
        Domain: "vpc",
        TagSpecifications: [
          {
            ResourceType: "elastic-ip",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
