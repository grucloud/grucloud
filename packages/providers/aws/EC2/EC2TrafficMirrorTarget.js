const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("TrafficMirrorTargetId"),
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

// TODO OwnerId

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TrafficMirrorTarget = () => ({
  type: "TrafficMirrorTarget",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: ["TrafficMirrorTargetId", "OwnerId"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "InvalidTrafficMirrorTargetId.NotFound",
    "InvalidParameterValue",
  ],
  dependencies: {
    networkInterface: {
      type: "NetworkInterface",
      group: "EC2",
      optional: true,
      pathId: "NetworkInterfaceId",
      dependencyId: ({ lives, config }) => pipe([get("NetworkInterfaceId")]),
    },
    networkLoadBalancer: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      optional: true,
      pathId: "NetworkLoadBalancerArn",
      dependencyId: ({ lives, config }) =>
        pipe([get("NetworkLoadBalancerArn")]),
    },
    gatewayLoadBalancer: {
      type: "VpcEndpoint",
      group: "EC2",
      optional: true,
      pathId: "GatewayLoadBalancerEndpointId",
      dependencyId: ({ lives, config }) =>
        pipe([get("GatewayLoadBalancerEndpointId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorTargets-property
  getById: {
    method: "describeTrafficMirrorTargets",
    getField: "TrafficMirrorTargets",
    pickId: pipe([
      tap(({ TrafficMirrorTargetId }) => {
        assert(TrafficMirrorTargetId);
      }),
      ({ TrafficMirrorTargetId }) => ({
        TrafficMirrorTargetIds: [TrafficMirrorTargetId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorTargets-property
  getList: {
    method: "describeTrafficMirrorTargets",
    getParam: "TrafficMirrorTargets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTrafficMirrorTarget-property
  create: {
    method: "createTrafficMirrorTarget",
    pickCreated: ({ payload }) => pipe([get("TrafficMirrorTarget")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTrafficMirrorTarget-property
  destroy: {
    method: "deleteTrafficMirrorTarget",
    pickId: pipe([pick(["TrafficMirrorTargetId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      networkInterface,
      networkLoadBalancer,
      gatewayLoadBalancer,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "traffic-mirror-target",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      switchCase([
        () => networkInterface,
        defaultsDeep({
          NetworkInterfaceId: getField(networkInterface, "NetworkInterfaceId"),
        }),
        () => networkLoadBalancer,
        defaultsDeep({
          NetworkLoadBalancerArn: getField(
            networkLoadBalancer,
            "LoadBalancerArn"
          ),
        }),
        () => gatewayLoadBalancer,
        defaultsDeep({
          GatewayLoadBalancerEndpointId: getField(
            gatewayLoadBalancer,
            "VpcEndpointId"
          ),
        }),
        () => {
          assert(
            false,
            "missing networkInterface, networkLoadBalancer or gatewayLoadBalancer"
          );
        },
      ]),
    ])(),
});
