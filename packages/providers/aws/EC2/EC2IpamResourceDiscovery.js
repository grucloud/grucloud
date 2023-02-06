const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, map, not } = require("rubico");
const { defaultsDeep, find, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags } = require("../AwsCommon");
const { tagResource, untagResource, assignIpamRegion } = require("./EC2Common");

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => [
        findNameInTags({}),
        get("Description"),
        // TODO add locale ?
        () => "ipam-resourcediscovery",
      ],
      map((fn) => fn(live)),
      find(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

const findId = () =>
  pipe([
    get("IpamResourceDiscoveryId"),
    tap((IpamResourceDiscoveryId) => {
      assert(IpamResourceDiscoveryId);
    }),
  ]);

// TODO  "OwnerId"
const managedByOther = () => get("IsDefault");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamResourceDiscovery = ({ compare }) => ({
  type: "IpamResourceDiscovery",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamResourceDiscoveryId.NotFound"],
  findName: ({ lives, config }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      switchCase([
        get("IsDefault"),
        () => "default",
        findName({ lives, config }),
      ]),
    ]),
  findId,
  cannotBeDeleted: managedByOther,
  managedByOther,
  omitProperties: [
    "OwnerId",
    "IpamResourceDiscoveryId",
    "IpamResourceDiscoveryArn",
    "State",
  ],
  filterLive: ({ providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      // IpamResourceDiscoveryRegion
      // OperatingRegions[].RegionName
      //assignIpamRegion({ providerConfig }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeIpamResourceDiscoveries-property
  getById: {
    pickId: pipe([
      ({ IpamResourceDiscoveryId }) => ({
        IpamResourceDiscoveryIds: [IpamResourceDiscoveryId],
      }),
    ]),
    method: "describeIpamResourceDiscoveries",
    getField: "IpamResourceDiscoveries",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeIpamResourceDiscoveries-property
  getList: {
    method: "describeIpamResourceDiscoveries",
    getParam: "IpamResourceDiscoveries",
  },
  create: {
    method: "createIpamResourceDiscovery",
    pickCreated: ({ payload }) => pipe([get("IpamResourceDiscovery")]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  // TODO modifyIpamResourceDiscovery
  destroy: {
    method: "deleteIpamResourceDiscovery",
    pickId: pipe([pick(["IpamResourceDiscoveryId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
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
            ResourceType: "ipam-resource-discovery",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
