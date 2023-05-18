const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("TrafficMirrorSessionId"),
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
exports.EC2TrafficMirrorSession = () => ({
  type: "TrafficMirrorSession",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: ["TrafficMirrorSessionId"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: [
    "InvalidTrafficMirrorSessionId.NotFound",
    "InvalidParameterValue",
  ],
  dependencies: {
    networkInterface: {
      type: "NetworkInterface",
      group: "EC2",
      required: true,
      pathId: "NetworkInterfaceId",
      dependencyId: ({ lives, config }) => pipe([get("NetworkInterfaceId")]),
    },
    trafficMirrorFilter: {
      type: "TrafficMirrorFilter",
      group: "EC2",
      required: true,
      pathId: "TrafficMirrorFilterId",
      dependencyId: ({ lives, config }) => pipe([get("TrafficMirrorFilterId")]),
    },
    trafficMirrorTarget: {
      type: "TrafficMirrorTarget",
      group: "EC2",
      required: true,
      pathId: "TrafficMirrorTargetId",
      dependencyId: ({ lives, config }) => pipe([get("TrafficMirrorTargetId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorSessions-property
  getById: {
    method: "describeTrafficMirrorSessions",
    getField: "TrafficMirrorSessions",
    pickId: pipe([
      tap(({ TrafficMirrorSessionId }) => {
        assert(TrafficMirrorSessionId);
      }),
      ({ TrafficMirrorSessionId }) => ({
        TrafficMirrorSessionIds: [TrafficMirrorSessionId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTrafficMirrorSessions-property
  getList: {
    method: "describeTrafficMirrorSessions",
    getParam: "TrafficMirrorSessions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTrafficMirrorSession-property
  create: {
    method: "createTrafficMirrorSession",
    pickCreated: ({ payload }) => pipe([get("TrafficMirrorSession")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyTrafficMirrorSession-property
  update: {
    method: "modifyTrafficMirrorSession",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTrafficMirrorSession-property
  destroy: {
    method: "deleteTrafficMirrorSession",
    pickId: pipe([pick(["TrafficMirrorSessionId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      networkInterface,
      trafficMirrorFilter,
      trafficMirrorTarget,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(networkInterface);
        assert(trafficMirrorFilter);
        assert(trafficMirrorTarget);
      }),
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "traffic-mirror-session",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
        NetworkInterfaceId: getField(networkInterface, "NetworkInterfaceId"),
        TrafficMirrorFilterId: getField(
          trafficMirrorFilter,
          "TrafficMirrorFilterId"
        ),
        TrafficMirrorTargetId: getField(
          trafficMirrorTarget,
          "TrafficMirrorTargetId"
        ),
      }),
    ])(),
});
